import { Injectable, Logger } from '@nestjs/common';
import {
  ExecutionErrorService,
  ErrorCategory,
} from '../errors/execution-error.service';

export interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  backoffFactor?: number;
}

@Injectable()
export class RetryEngineService {
  private readonly logger = new Logger(RetryEngineService.name);

  constructor(private readonly errorService: ExecutionErrorService) {}

  /**
   * Executes an asynchronous operation with retry and backoff logic for retryable errors.
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {},
  ): Promise<T> {
    const maxAttempts = options.maxAttempts ?? 3;
    let delay = options.initialDelayMs ?? 1000;
    const backoffFactor = options.backoffFactor ?? 2;

    let attempt = 1;

    while (attempt <= maxAttempts) {
      try {
        return await operation();
      } catch (err: any) {
        const classified = this.errorService.classify(err);

        // If error is not retryable or we reached max attempts, rethrow
        if (!classified.isRetryable || attempt >= maxAttempts) {
          this.logger.error(
            `Execution failed permanently on attempt ${attempt}/${maxAttempts} [${classified.category}]: ${classified.message}`,
          );
          throw classified;
        }

        this.logger.warn(
          `Retryable failure detected on attempt ${attempt}/${maxAttempts}. Retrying in ${delay}ms... Reason: ${classified.message}`,
        );

        await this.sleep(delay);
        delay *= backoffFactor;
        attempt++;
      }
    }

    throw new Error('Unexpected retry loop termination.');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
