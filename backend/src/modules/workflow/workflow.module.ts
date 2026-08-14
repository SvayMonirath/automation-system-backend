import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationModule } from '../validation/validation.module';
import { WorkflowController } from './workflow.controller';

import { WorkflowExecutionWorker } from '../worker/workflow-execution.worker';
import { ExecutionContextManager } from './../worker/execution-context.manager';
import { ExecutionLogService } from '../worker/services/execution-log.service';
import { DataMappingEngine } from '../worker/engines/data-mapping.engine';
import { ExecutionErrorService } from '../worker/errors/execution-error.service';
import { RetryEngineService } from '../worker/engines/retry-engine.service';
// Node Processors
import { TelegramTriggerProcessor } from './../worker/processors/telegram-trigger.processor';
import { AiIntentProcessor } from '../worker/processors/ai-intent.processor';
import { AiExtractionProcessor } from '../worker/processors/ai-extraction.processor';
import { GoogleSheetLookupProcessor } from '../worker/processors/google-sheet-lookup.processor';
import { AiResponseProcessor } from '../worker/processors/ai-response.processor';
import { IfConditionProcessor } from '../worker/processors/if-condition.processor';
import { TelegramReplyProcessor } from '../worker/processors/telegram-reply.processor';
import { EmailNotificationProcessor } from '../worker/processors/email-notification.processor';

@Module({
  imports: [PrismaModule, ValidationModule],
  controllers: [WorkflowController],
  providers: [
    PrismaService,
    WorkflowExecutionWorker,
    ExecutionContextManager,
    ExecutionLogService,
    DataMappingEngine,
    TelegramTriggerProcessor,
    AiIntentProcessor,
    AiExtractionProcessor,
    GoogleSheetLookupProcessor,
    AiResponseProcessor,
    IfConditionProcessor,
    TelegramReplyProcessor,
    EmailNotificationProcessor,
    ExecutionErrorService,
    RetryEngineService,
  ],
  exports: [
    WorkflowExecutionWorker,
    ExecutionContextManager,
    ExecutionLogService,
    DataMappingEngine,
  ],
})
export class WorkerModule {}
