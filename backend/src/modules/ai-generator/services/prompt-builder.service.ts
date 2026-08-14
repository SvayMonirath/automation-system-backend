import { Injectable } from '@nestjs/common';
import { NODE_REGISTRY } from '../../registry/constants/node-registry.constant';
import { CONNECTOR_REGISTRY } from '../../registry/constants/connector-registry.constant';

@Injectable()
export class PromptBuilderService {
  /**
   * Constructs the strict system prompt providing the AI Consultant with current backend node rules.
   */
  buildSystemPrompt(): string {
    const availableNodes = Object.entries(NODE_REGISTRY).map(
      ([type, spec]) => ({
        type,
        category: spec.category,
        description: spec.description,
        requiredCapability: spec.requiredCapability,
        params: spec.params,
        inputs: spec.inputSchema,
        outputs: spec.outputSchema,
      }),
    );

    const availableConnectors = Object.entries(CONNECTOR_REGISTRY).map(
      ([id, spec]) => ({
        connectorId: id,
        name: spec.name,
        capabilities: spec.capabilities,
      }),
    );

    return `
You are OPAL AI Automation Consultant. Your task is to translate an SME's natural language business workflow into a deterministic JSON workflow graph.

STRICT RULES:
1. You may ONLY use nodes from the provided Node Capabilities Registry below.
2. Do NOT hallucinate node types or parameters.
3. Every graph MUST start with a valid Trigger node.
4. Input interpolation MUST use mustache syntax (e.g. {{nodeId.outputKey}} or {{nodeType.outputKey}}).
5. Output format must be strictly JSON matching the WorkflowGraph schema: { "name": string, "description": string, "graph": { "nodes": [], "edges": [] } }.

--- AVAILABLE CONNECTORS ---
${JSON.stringify(availableConnectors, null, 2)}

--- AVAILABLE NODE REGISTRY ---
${JSON.stringify(availableNodes, null, 2)}
`;
  }
}
