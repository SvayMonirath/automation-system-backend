import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

@Injectable()
export class ExecutionLogService {
  private readonly logger = new Logger(ExecutionLogService.name);

  // Blacklist of sensitive key patterns to redact
  private readonly SENSITIVE_KEYS = [
    'password',
    'token',
    'accesstoken',
    'bottoken',
    'secret',
    'authorization',
    'apikey',
    'bearer',
  ];

  constructor(private readonly prisma: PrismaService) {}

  async log(
    executionId: string,
    nodeId: string | null,
    level: LogLevel,
    message: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    const sanitizedMetadata = metadata ? this.sanitize(metadata) : undefined;

    this.logger.log(
      `[${level}] Execution ${executionId} | Node: ${nodeId || 'GLOBAL'} | ${message}`,
    );

    await this.prisma.executionLog.create({
      data: {
        executionId,
        nodeId,
        level,
        message,
        metadata: sanitizedMetadata ?? {},
      },
    });
  }

  /**
   * Recursively sanitizes objects to mask sensitive values.
   */
  private sanitize(obj: any): any {
    if (obj === null || obj === undefined) return obj;

    if (typeof obj === 'string') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitize(item));
    }

    if (typeof obj === 'object') {
      const sanitized: Record<string, any> = {};
      for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();
        if (
          this.SENSITIVE_KEYS.some((sensitive) => lowerKey.includes(sensitive))
        ) {
          sanitized[key] = '***REDACTED***';
        } else {
          sanitized[key] = this.sanitize(value);
        }
      }
      return sanitized;
    }

    return obj;
  }
}
