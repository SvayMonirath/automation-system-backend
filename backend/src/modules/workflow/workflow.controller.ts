import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WorkflowService } from './workflow.service';
import {
  CreateWorkflowDto,
  UpdateWorkflowDraftDto,
  UpdateWorkflowStatusDto,
} from './dto/workflow.dto';

@ApiTags('Workflows')
@Controller('workflows')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  // Mocked User ID for now until AuthGuard is attached in Phase 3
  private getUserId(req: any): string {
    return req.user?.id || 'mock-user-id';
  }

  @Post()
  @ApiOperation({ summary: 'Create a new draft workflow' })
  createWorkflow(@Request() req: any, @Body() dto: CreateWorkflowDto) {
    return this.workflowService.createWorkflow(this.getUserId(req), dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all user workflows' })
  getUserWorkflows(@Request() req: any) {
    return this.workflowService.getUserWorkflows(this.getUserId(req));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workflow details with draft & active version' })
  getWorkflowById(@Request() req: any, @Param('id') id: string) {
    return this.workflowService.getWorkflowById(this.getUserId(req), id);
  }

  @Put(':id/draft')
  @ApiOperation({ summary: 'Update draft graph definition' })
  updateWorkflowDraft(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateWorkflowDraftDto,
  ) {
    return this.workflowService.updateWorkflowDraft(
      this.getUserId(req),
      id,
      dto,
    );
  }

  @Post(':id/publish')
  @ApiOperation({
    summary: 'Publish current draft into an immutable active version',
  })
  publishWorkflowVersion(@Request() req: any, @Param('id') id: string) {
    return this.workflowService.publishWorkflowVersion(this.getUserId(req), id);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update workflow lifecycle status (ACTIVE, PAUSED, ARCHIVED)',
  })
  updateWorkflowStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateWorkflowStatusDto,
  ) {
    return this.workflowService.updateWorkflowStatus(
      this.getUserId(req),
      id,
      dto,
    );
  }
}
