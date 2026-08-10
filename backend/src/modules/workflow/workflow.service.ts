import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateWorkflowDto,
  UpdateWorkflowDraftDto,
  UpdateWorkflowStatusDto,
} from './dto/workflow.dto';
import { WorkflowStatus } from '@prisma/client';

@Injectable()
export class WorkflowService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new draft workflow along with its initial version (Version 1)
   */
  async createWorkflow(userId: string, dto: CreateWorkflowDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Create main workflow entity
      const workflow = await tx.workflow.create({
        data: {
          userId,
          name: dto.name,
          description: dto.description,
          status: WorkflowStatus.DRAFT,
        },
      });

      // 2. Create initial draft version (Version 1)
      const initialDefinition = dto.definition || {
        nodes: [],
        connections: [],
      };
      const version = await tx.workflowVersion.create({
        data: {
          workflowId: workflow.id,
          versionNumber: 1,
          definition: initialDefinition,
          isPublished: false,
        },
      });

      return {
        ...workflow,
        draftVersion: version,
      };
    });
  }

  /**
   * Retrieve all workflows owned by a user
   */
  async getUserWorkflows(userId: string) {
    return this.prisma.workflow.findMany({
      where: { userId },
      include: {
        activeVersion: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Retrieve a specific workflow with its latest draft and active version
   */
  async getWorkflowById(userId: string, workflowId: string) {
    const workflow = await this.prisma.workflow.findFirst({
      where: { id: workflowId, userId },
      include: {
        activeVersion: true,
        versions: {
          orderBy: { versionNumber: 'desc' },
          take: 1, // Retrieves latest version (draft)
        },
      },
    });

    if (!workflow) {
      throw new NotFoundException(
        `Workflow with ID '${workflowId}' not found.`,
      );
    }

    return workflow;
  }

  /**
   * Save changes to an unpublished draft graph definition
   */
  async updateWorkflowDraft(
    userId: string,
    workflowId: string,
    dto: UpdateWorkflowDraftDto,
  ) {
    const workflow = await this.getWorkflowById(userId, workflowId);

    // Get latest version
    const latestVersion = workflow.versions[0];

    return this.prisma.$transaction(async (tx) => {
      // Update basic details
      if (dto.name || dto.description) {
        await tx.workflow.update({
          where: { id: workflowId },
          data: {
            name: dto.name ?? workflow.name,
            description: dto.description ?? workflow.description,
          },
        });
      }

      // If latest version is already published, spawn a new draft version
      if (latestVersion.isPublished) {
        const nextVersionNumber = latestVersion.versionNumber + 1;
        return tx.workflowVersion.create({
          data: {
            workflowId,
            versionNumber: nextVersionNumber,
            definition: dto.definition,
            isPublished: false,
          },
        });
      }

      // Otherwise, update the existing draft version
      return tx.workflowVersion.update({
        where: { id: latestVersion.id },
        data: {
          definition: dto.definition,
        },
      });
    });
  }

  /**
   * Publish a draft version into an immutable active version
   */
  async publishWorkflowVersion(userId: string, workflowId: string) {
    const workflow = await this.getWorkflowById(userId, workflowId);
    const latestVersion = workflow.versions[0];

    if (!latestVersion) {
      throw new BadRequestException('No version definition found to publish.');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Freeze draft version into a published state
      const publishedVersion = await tx.workflowVersion.update({
        where: { id: latestVersion.id },
        data: { isPublished: true },
      });

      // 2. Set this published version as the active version of the workflow
      const updatedWorkflow = await tx.workflow.update({
        where: { id: workflowId },
        data: {
          activeVersionId: publishedVersion.id,
          status: WorkflowStatus.READY, // Set state to READY (or ACTIVE if no credentials missing)
        },
        include: { activeVersion: true },
      });

      return updatedWorkflow;
    });
  }

  /**
   * Manage lifecycle status transitions (ACTIVE, PAUSED, ARCHIVED, etc.)
   */
  async updateWorkflowStatus(
    userId: string,
    workflowId: string,
    dto: UpdateWorkflowStatusDto,
  ) {
    const workflow = await this.getWorkflowById(userId, workflowId);

    // Prevent activating a workflow without a published active version
    if (dto.status === WorkflowStatus.ACTIVE && !workflow.activeVersionId) {
      throw new BadRequestException(
        'Cannot activate a workflow without a published version.',
      );
    }

    return this.prisma.workflow.update({
      where: { id: workflowId },
      data: { status: dto.status },
    });
  }
}
