import { Injectable, Logger } from '@nestjs/common';
import { NODE_REGISTRY } from '../../registry/constants/node-registry.constant';
import { CONNECTOR_REGISTRY } from '../../registry/constants/connector-registry.constant';
import { PrismaService } from 'src/prisma/prisma.service';

export interface SetupRequirement {
  id: string;
  type: 'CREDENTIAL' | 'PARAMETER' | 'CONNECTOR';
  targetNodeId: string;
  targetNodeType: string;
  title: string;
  description: string;
  isFulfilled: boolean;
  actionPayload?: Record<string, any>;
}

export interface SetupAnalysisResult {
  workflowReady: boolean;
  totalRequirements: number;
  unfulfilledCount: number;
  requirements: SetupRequirement[];
}

@Injectable()
export class SetupRequirementService {
  private readonly logger = new Logger(SetupRequirementService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates a workflow graph definition against user credentials and parameter requirements.
   */
  async analyzeRequirements(
    graph: { nodes: any[]; edges: any[] },
    userId: string,
  ): Promise<SetupAnalysisResult> {
    this.logger.log(`Analyzing setup requirements for user: ${userId}`);

    // 1. Fetch all user credentials currently active in DB
    const userCredentials = await this.prisma.credential.findMany({
      where: { userId },
      select: { connectorId: true, type: true },
    });

    const userConnectedConnectors = new Set(
      userCredentials.map((c) => c.connectorId),
    );
    const requirements: SetupRequirement[] = [];

    for (const node of graph.nodes) {
      const nodeSpec = NODE_REGISTRY[node.type];
      if (!nodeSpec) continue;

      // 2. Check Credential & Connector Requirements
      if (nodeSpec.requiredCapability) {
        const matchingConnector = Object.entries(CONNECTOR_REGISTRY).find(
          ([, spec]) =>
            spec.capabilities.includes(nodeSpec.requiredCapability!),
        );

        if (matchingConnector) {
          const [connectorId, connectorSpec] = matchingConnector;
          const isConnected = userConnectedConnectors.has(connectorId);

          requirements.push({
            id: `req_cred_${node.id}_${connectorId}`,
            type: 'CREDENTIAL',
            targetNodeId: node.id,
            targetNodeType: node.type,
            title: `Connect ${connectorSpec.name}`,
            description: `Requires active ${connectorSpec.name} account with capability "${nodeSpec.requiredCapability}".`,
            isFulfilled: isConnected,
            actionPayload: {
              connectorId,
              authType: connectorSpec.authType,
              requiredCapability: nodeSpec.requiredCapability,
            },
          });
        }
      }

      // 3. Check Mandatory Parameter Configurations
      const requiredParams = nodeSpec.params || [];
      const nodeParams = node.params || {};

      for (const param of requiredParams) {
        const isProvided =
          nodeParams[param.name] !== undefined && nodeParams[param.name] !== '';

        requirements.push({
          id: `req_param_${node.id}_${param.name}`,
          type: 'PARAMETER',
          targetNodeId: node.id,
          targetNodeType: node.type,
          title: `Configure ${param.name} on ${node.label || node.type}`,
          description:
            param.description ||
            `Required parameter "${param.name}" (${param.type}) is missing.`,
          isFulfilled: isProvided,
          actionPayload: {
            parameterName: param.name,
            parameterType: param.type,
            options: param.options,
          },
        });
      }
    }

    const unfulfilledCount = requirements.filter((r) => !r.isFulfilled).length;

    return {
      workflowReady: unfulfilledCount === 0,
      totalRequirements: requirements.length,
      unfulfilledCount,
      requirements,
    };
  }
}
