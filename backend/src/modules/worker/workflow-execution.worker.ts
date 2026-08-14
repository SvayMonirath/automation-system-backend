import { PrismaService } from 'src/prisma/prisma.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { WorkflowExecutionJobData } from '../queue/queue-producer.service';
import { ExecutionContextManager } from './execution-context.manager';

// Processor mapping
import { TelegramTriggerProcessor } from './processors/telegram-trigger.processor';
import { AiIntentProcessor } from './processors/ai-intent.processor';
import { AiExtractionProcessor } from './processors/ai-extraction.processor';
import { GoogleSheetLookupProcessor } from './processors/google-sheet-lookup.processor';
import { AiResponseProcessor } from './processors/ai-response.processor';
import { IfConditionProcessor } from './processors/if-condition.processor';
import { TelegramReplyProcessor } from './processors/telegram-reply.processor';
import { EmailNotificationProcessor } from './processors/email-notification.processor';

@Processor('workflow-execution')
export class WorkflowExecutionWorker extends WorkerHost {
  private readonly logger = new Logger(WorkflowExecutionWorker.name);
  private readonly processorRegistry: Map<string, any>;

  constructor(
    private readonly prisma: PrismaService,
    private readonly contextManager: ExecutionContextManager,
    telegramTrigger: TelegramTriggerProcessor,
    aiIntent: AiIntentProcessor,
    aiExtraction: AiExtractionProcessor,
    googleSheetLookup: GoogleSheetLookupProcessor,
    aiResponse: AiResponseProcessor,
    ifCondition: IfConditionProcessor,
    telegramReply: TelegramReplyProcessor,
    emailNotification: EmailNotificationProcessor,
  ) {
    super();
    this.processorRegistry = new Map([
      ['telegram_trigger', telegramTrigger],
      ['ai_intent', aiIntent],
      ['ai_extraction', aiExtraction],
      ['google_sheet_lookup', googleSheetLookup],
      ['ai_response', aiResponse],
      ['if_condition', ifCondition],
      ['telegram_reply', telegramReply],
      ['email_notification', emailNotification],
    ]);
  }

  async process(job: Job<WorkflowExecutionJobData>): Promise<any> {
    const { executionId, workflowVersionId, triggerPayload } = job.data;
    this.logger.log(
      `Starting execution worker for Execution ID: ${executionId}`,
    );

    // Update execution status to RUNNING
    await this.prisma.execution.update({
      where: { id: executionId },
      data: { status: 'RUNNING', startedAt: new Date() },
    });

    try {
      const version = await this.prisma.workflowVersion.findUnique({
        where: { id: workflowVersionId },
      });

      if (!version) {
        throw new Error(`Workflow version ${workflowVersionId} not found.`);
      }

      const graph = version.graph as { nodes: any[]; edges: any[] };
      let contextData: Record<string, any> = { triggerPayload };

      // Topological or linear execution of graph nodes
      for (const node of graph.nodes) {
        this.logger.log(`Executing node ${node.id} (${node.type})...`);

        const processor = this.processorRegistry.get(node.type);
        if (!processor) {
          throw new Error(
            `No processor found registered for node type: ${node.type}`,
          );
        }

        // Resolve inputs dynamically via Context Manager
        const resolvedInputs = this.contextManager.resolveInputs(
          node.inputs || {},
          contextData,
        );

        const startTime = Date.now();
        const executionResult = await processor.execute({
          executionId,
          workflowVersionId,
          nodeId: node.id,
          nodeInputs: resolvedInputs,
          params: node.params || {},
          contextData,
        });

        const durationMs = Date.now() - startTime;

        // Log node execution details
        await this.prisma.nodeExecution.create({
          data: {
            executionId,
            nodeId: node.id,
            nodeType: node.type,
            status: executionResult.success ? 'SUCCESS' : 'FAILED',
            inputData: resolvedInputs,
            outputData: executionResult.data || {},
            errorData: executionResult.error || null,
            durationMs,
          },
        });

        if (!executionResult.success) {
          throw new Error(
            `Node ${node.id} (${node.type}) failed: ${executionResult.error?.message}`,
          );
        }

        // Update context data state for downstream nodes
        contextData = this.contextManager.mergeOutput(
          contextData,
          node.id,
          node.type,
          executionResult.data,
        );
      }

      // Mark execution as COMPLETED
      await this.prisma.execution.update({
        where: { id: executionId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          contextData,
        },
      });

      this.logger.log(`Successfully completed Execution ID: ${executionId}`);
    } catch (err: any) {
      this.logger.error(
        `Execution ID ${executionId} failed: ${err.message}`,
        err.stack,
      );

      await this.prisma.execution.update({
        where: { id: executionId },
        data: {
          status: 'FAILED',
          completedAt: new Date(),
          errorDetails: { message: err.message },
        },
      });

      throw err; // Re-throw to trigger BullMQ retry logic if applicable
    }
  }
}
