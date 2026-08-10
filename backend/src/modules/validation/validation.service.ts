import { Injectable } from '@nestjs/common';
import { RegistryService } from '../registry/registry.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ValidationResult,
  ValidationErrorItem,
  ValidationErrorType,
} from './interfaces/validation.interface';

@Injectable()
export class ValidationService {
  constructor(
    private readonly registryService: RegistryService,
    private readonly prisma: PrismaService,
  ) {}

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
