import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { TriggerWorkflowDto } from './dto/execution.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExecutionService {
  private readonly logger = new Logger(ExecutionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createExecution(dto: TriggerWorkflowDto) {
    this.logger.log(`Initiating execution for workflow ${dto.workflowId}...`);

    // 1. Retrieve the workflow and ensure it is in ACTIVE status
    const workflow = await this.prisma.workflow.findUnique({
      where: { id: dto.workflowId },
      include: { versions: { orderBy: { version: 'desc' }, take: 1 } },
    });

    if (!workflow) {
      throw new NotFoundException(
        `Workflow with ID ${dto.workflowId} not found.`,
      );
    }

    if (workflow.status !== 'ACTIVE') {
      throw new BadRequestException(
        `Workflow ${dto.workflowId} is not ACTIVE (current status: ${workflow.status}).`,
      );
    }

    const activeVersion = workflow.versions[0];
    if (!activeVersion) {
      throw new BadRequestException(
        `Workflow ${dto.workflowId} has no published active version.`,
      );
    }

    // 2. Create Execution record in PostgreSQL with PENDING status
    const execution = await this.prisma.execution.create({
      data: {
        workflowId: workflow.id,
        workflowVersionId: activeVersion.id,
        status: 'PENDING',
        triggerPayload: dto.triggerPayload || {},
        contextData: {},
      },
    });

    this.logger.log(
      `Created execution record ${execution.id} [PENDING] for version ${activeVersion.id}`,
    );

    return {
      execution,
      activeVersion,
    };
  }

  async getExecutionById(executionId: string) {
    const execution = await this.prisma.execution.findUnique({
      where: { id: executionId },
      include: { nodeExecutions: true, logs: true },
    });

    if (!execution) {
      throw new NotFoundException(`Execution record ${executionId} not found.`);
    }

    return execution;
  }
}
