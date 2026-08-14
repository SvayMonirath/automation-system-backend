import { Injectable } from '@nestjs/common';
import { RegistryService } from '../registry/registry.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ValidationResult,
  ValidationErrorItem,
  ValidationErrorType,
} from './interfaces/validation.interface';
import { NODE_REGISTRY } from '../registry/constants/node-registry.constant';

export interface GraphValidationError {
  nodeId?: string;
  field?: string;
  message: string;
  code:
    | 'UNKNOWN_NODE'
    | 'MISSING_PARAM'
    | 'INVALID_TOPOLOGY'
    | 'MISSING_TRIGGER'
    | 'AUTH_ERROR';
}

export interface GraphValidationResult {
  isValid: boolean;
  errors: GraphValidationError[];
  warnings?: string[];
}

@Injectable()
export class ValidationService {
  constructor(
    private readonly registryService: RegistryService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Deterministically validates an in-memory graph definition before saving, publishing, or executing.
   */
  async validateGraph(
    graph: { nodes: any[]; edges: any[] },
    userId: string,
  ): Promise<GraphValidationResult> {
    const errors: GraphValidationError[] = [];

    // 1. Structure Check: Graph must have nodes
    if (!graph || !Array.isArray(graph.nodes) || graph.nodes.length === 0) {
      return {
        isValid: false,
        errors: [
          {
            message: 'Graph must contain at least one node.',
            code: 'INVALID_TOPOLOGY',
          },
        ],
      };
    }

    // 2. Trigger Check: First node or root node must be a TRIGGER type
    const triggerNodes = graph.nodes.filter((node) => {
      const spec = NODE_REGISTRY[node.type];
      return spec && spec.category === 'TRIGGER';
    });

    if (triggerNodes.length === 0) {
      errors.push({
        message: 'Graph must contain at least one valid Trigger node.',
        code: 'MISSING_TRIGGER',
      });
    }

    // 3. Node Specification & Required Parameters Check
    for (const node of graph.nodes) {
      const nodeSpec = NODE_REGISTRY[node.type];

      // Ensure node is registered in NODE_REGISTRY
      if (!nodeSpec) {
        errors.push({
          nodeId: node.id,
          message: `Unknown node type "${node.type}". It is not registered in NODE_REGISTRY.`,
          code: 'UNKNOWN_NODE',
        });
        continue;
      }

      // Check required parameters defined in spec
      if (nodeSpec.requiredParams && Array.isArray(nodeSpec.requiredParams)) {
        for (const paramName of nodeSpec.requiredParams) {
          if (
            !node.params ||
            node.params[paramName] === undefined ||
            node.params[paramName] === ''
          ) {
            errors.push({
              nodeId: node.id,
              field: paramName,
              message: `Missing required parameter "${paramName}" for node "${node.label || node.type}".`,
              code: 'MISSING_PARAM',
            });
          }
        }
      }
    }

    // 4. Edge & Topology Integrity Check
    const nodeIds = new Set(graph.nodes.map((n) => n.id));
    if (Array.isArray(graph.edges)) {
      for (const edge of graph.edges) {
        if (!nodeIds.has(edge.source)) {
          errors.push({
            message: `Edge source "${edge.source}" does not exist in graph nodes.`,
            code: 'INVALID_TOPOLOGY',
          });
        }
        if (!nodeIds.has(edge.target)) {
          errors.push({
            message: `Edge target "${edge.target}" does not exist in graph nodes.`,
            code: 'INVALID_TOPOLOGY',
          });
        }
      }
    }

    // 5. Credential Ownership Check (Optional for AI Generation draft preview, mandatory before run)
    // Checks if the user has required connector credentials if strictly needed

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Main deterministic validation engine for workflow graphs
   */
  async validateWorkflowGraph(
    userId: string,
    definition: Record<string, any>,
  ): Promise<ValidationResult> {
    const errors: ValidationErrorItem[] = [];
    const missingCapabilitiesSet = new Set<string>();

    const nodes: any[] = definition?.nodes || [];
    const connections: any[] = definition?.connections || [];

    if (!Array.isArray(nodes) || nodes.length === 0) {
      errors.push({
        type: ValidationErrorType.INVALID_CONNECTION,
        message: 'Workflow must contain at least one node.',
      });
      return { isValid: false, errors, missingCapabilities: [] };
    }

    const nodeIds = new Set<string>();

    // 1. Validate Node Types and Parameter Schemas
    for (const node of nodes) {
      if (!node.id || !node.type) {
        errors.push({
          type: ValidationErrorType.INVALID_NODE_TYPE,
          nodeId: node.id,
          message: 'Node is missing required "id" or "type" attribute.',
        });
        continue;
      }

      nodeIds.add(node.id);

      // Verify node type exists in Registry
      let spec;
      try {
        spec = this.registryService.getNodeSpec(node.type);
      } catch (err) {
        errors.push({
          type: ValidationErrorType.INVALID_NODE_TYPE,
          nodeId: node.id,
          message: `Node type '${node.type}' does not exist in Node Registry.`,
        });
        continue;
      }

      // Track capability requirement
      if (spec.requiredCapability) {
        missingCapabilitiesSet.add(spec.requiredCapability);
      }

      // Check required parameters
      const userParams = node.params || {};
      for (const paramSpec of spec.params) {
        if (
          paramSpec.required &&
          (userParams[paramSpec.key] === undefined ||
            userParams[paramSpec.key] === null)
        ) {
          errors.push({
            type: ValidationErrorType.MISSING_REQUIRED_PARAM,
            nodeId: node.id,
            field: paramSpec.key,
            message: `Required parameter '${paramSpec.key}' is missing for node '${node.id}'.`,
          });
        }
      }
    }

    // 2. Validate Graph Connections
    for (const conn of connections) {
      if (!nodeIds.has(conn.source)) {
        errors.push({
          type: ValidationErrorType.INVALID_CONNECTION,
          message: `Connection references non-existent source node '${conn.source}'.`,
        });
      }
      if (!nodeIds.has(conn.target)) {
        errors.push({
          type: ValidationErrorType.INVALID_CONNECTION,
          message: `Connection references non-existent target node '${conn.target}'.`,
        });
      }
    }

    // 3. Validate User Credentials for Required Capabilities
    const requiredCapabilities = Array.from(missingCapabilitiesSet);
    const unfulfilledCapabilities: string[] = [];

    if (requiredCapabilities.length > 0 && userId) {
      // Find all valid credentials owned by user
      const userCredentials = await this.prisma.credential.findMany({
        where: { userId },
        select: { connectorType: true },
      });

      const userConnectorTypes = new Set(
        userCredentials.map((c) => c.connectorType),
      );

      for (const cap of requiredCapabilities) {
        const connectorType = cap.split(':')[0]; // e.g., 'telegram' from 'telegram:send_message'
        if (!userConnectorTypes.has(connectorType)) {
          unfulfilledCapabilities.push(cap);
          errors.push({
            type: ValidationErrorType.MISSING_CREDENTIAL,
            message: `Missing active credential connection for connector '${connectorType}' required by capability '${cap}'.`,
          });
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      missingCapabilities: unfulfilledCapabilities,
    };
  }
}
