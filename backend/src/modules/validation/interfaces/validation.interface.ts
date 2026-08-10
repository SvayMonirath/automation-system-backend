export enum ValidationErrorType {
  INVALID_NODE_TYPE = 'INVALID_NODE_TYPE',
  MISSING_REQUIRED_PARAM = 'MISSING_REQUIRED_PARAM',
  INVALID_CONNECTION = 'INVALID_CONNECTION',
  MISSING_CREDENTIAL = 'MISSING_CREDENTIAL',
  ORPHAN_NODE = 'ORPHAN_NODE',
  GRAPH_CYCLE_DETECTED = 'GRAPH_CYCLE_DETECTED',
}

export interface ValidationErrorItem {
  type: ValidationErrorType;
  nodeId?: string;
  field?: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrorItem[];
  missingCapabilities: string[];
}
