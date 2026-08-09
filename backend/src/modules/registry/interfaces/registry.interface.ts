export enum NodeType {
  TRIGGER = 'TRIGGER',
  AI = 'AI',
  DATA = 'DATA',
  LOGIC = 'LOGIC',
  ACTION = 'ACTION',
}

export interface NodeParamSchema {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'json' | 'select';
  required: boolean;
  defaultValue?: any;
  options?: { label: string; value: any }[];
  description?: string;
}

export interface NodeSpec {
  type: string;
  category: NodeType;
  name: string;
  description: string;
  requiredCapability?: string;
  inputSchema: Record<string, any>;
  outputSchema: Record<string, any>;
  params: NodeParamSchema[];
}

export interface ConnectorSpec {
  type: string;
  name: string;
  description: string;
  authType: 'OAUTH2' | 'BOT_TOKEN' | 'API_KEY';
  capabilities: string[];
}
