export interface NodeExecutionContext {
  executionId: string;
  workflowVersionId: string;
  nodeId: string;
  nodeInputs: Record<string, any>;
  params: Record<string, any>;
  credentials?: Record<string, any>;
  contextData: Record<string, any>; // Accumulated outputs from upstream nodes
}

export interface NodeExecutionOutput {
  success: boolean;
  data?: Record<string, any>;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface INodeProcessor {
  execute(ctx: NodeExecutionContext): Promise<NodeExecutionOutput>;
}
