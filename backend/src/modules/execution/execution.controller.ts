// src/modules/execution/execution.controller.ts
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { QueueProducerService } from '../queue/queue-producer.service';
import { TriggerWorkflowDto } from './dto/execution.dto';

@Controller('executions')
export class ExecutionController {
  constructor(
    private readonly executionService: ExecutionService,
    private readonly queueProducerService: QueueProducerService,
  ) {}

  @Post('trigger')
  async triggerWorkflow(@Body() dto: TriggerWorkflowDto) {
    const { execution, activeVersion } =
      await this.executionService.createExecution(dto);

    // Enqueue execution job in BullMQ queue
    await this.queueProducerService.enqueueExecution({
      executionId: execution.id,
      workflowId: execution.workflowId,
      workflowVersionId: activeVersion.id,
      triggerPayload: dto.triggerPayload || {},
    });

    return {
      message: 'Workflow execution triggered successfully.',
      executionId: execution.id,
      status: execution.status,
    };
  }

  @Get(':id')
  async getExecutionStatus(@Param('id') id: string) {
    return this.executionService.getExecutionById(id);
  }
}
