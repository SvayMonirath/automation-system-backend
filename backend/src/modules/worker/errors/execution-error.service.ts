import { Injectable, Logger } from '@nestjs/common';

export enum ErrorCategory {
  TEMPORARY = 'TEMPORARY', // Network timeouts, rate limits (429, 503) -> Retryable
  AUTH = 'AUTH', // Expired tokens, invalid credentials (401, 403) -> Non-retryable
  CONFIGURATION = 'CONFIGURATION', // Missing parameters, invalid schemas -> Non-retryable
  SYSTEM = 'SYSTEM', // Unhandled runtime/infrastructure crashes -> Non-retryable
}

export interface ClassifiedError {
  category: ErrorCategory;
  isRetryable: boolean;
  message: string;
  originalError: any;
  suggestedAction?: string;
}

@Injectable()
export class ExecutionErrorService {
  private readonly logger = new Logger(ExecutionErrorService.name);

  classify(error: any): ClassifiedError {
    const errorMsg = error?.message?.toLowerCase() || '';
    const status =
      error?.status || error?.statusCode || error?.response?.status;

    // 1. Auth Errors (Credential issues)
    if (
      status === 401 ||
      status === 403 ||
      errorMsg.includes('auth') ||
      errorMsg.includes('unauthorized') ||
      errorMsg.includes('token') ||
      errorMsg.includes('credential')
    ) {
      return {
        category: ErrorCategory.AUTH,
        isRetryable: false,
        message: error.message || 'Authentication error with external service.',
        originalError: error,
        suggestedAction:
          'Please reconnect or refresh your connector credential.',
      };
    }

    // 2. Configuration Errors (Bad workflow parameters)
    if (
      status === 400 ||
      status === 422 ||
      errorMsg.includes('missing') ||
      errorMsg.includes('invalid') ||
      errorMsg.includes('schema')
    ) {
      return {
        category: ErrorCategory.CONFIGURATION,
        isRetryable: false,
        message: error.message || 'Configuration or input validation error.',
        originalError: error,
        suggestedAction:
          'Review node parameters and data mapping in the workflow editor.',
      };
    }

    // 3. Temporary Errors (Timeouts, Rate limits, Service downtimes)
    if (
      status === 429 ||
      status === 502 ||
      status === 503 ||
      status === 504 ||
      errorMsg.includes('timeout') ||
      errorMsg.includes('econnreset') ||
      errorMsg.includes('rate limit')
    ) {
      return {
        category: ErrorCategory.TEMPORARY,
        isRetryable: true,
        message: error.message || 'Temporary service interruption or timeout.',
        originalError: error,
        suggestedAction: 'Auto-retrying step with exponential backoff...',
      };
    }

    // 4. Default System Error
    return {
      category: ErrorCategory.SYSTEM,
      isRetryable: false,
      message: error.message || 'Unhandled internal execution failure.',
      originalError: error,
      suggestedAction: 'Check system worker logs.',
    };
  }
}
