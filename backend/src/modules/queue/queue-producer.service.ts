import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

export interface WorkflowExecutionJobData {
  executionId: string;
  workflowId: string;
  workflowVersionId: string;
  triggerPayload: Record<string, any>;
}

@Injectable()
export class QueueProducerService {
  private readonly logger = new Logger(QueueProducerService.name);

  constructor(
    @InjectQueue('workflow-execution') private readonly executionQueue: Queue,
  ) {}

  async enqueueExecution(jobData: WorkflowExecutionJobData) {
    this.logger.log(
      `Enqueueing execution job for executionId: ${jobData.executionId}`,
    );

    const job = await this.executionQueue.add('execute-workflow', jobData, {
      jobId: jobData.executionId,
    });

    return job;
  }
}
