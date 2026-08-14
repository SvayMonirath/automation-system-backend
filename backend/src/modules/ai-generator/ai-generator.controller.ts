import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import {
  WorkflowGeneratorService,
  GenerateWorkflowDto,
} from './workflow-generator.service';
import { SetupRequirementService } from './services/setup-requirement.service';
import { WORKFLOW_TEMPLATES } from './constants/templates.constant';

@Controller('ai-generator')
export class AiGeneratorController {
  constructor(
    private readonly generatorService: WorkflowGeneratorService,
    private readonly setupRequirementService: SetupRequirementService,
  ) {}

  @Get('templates')
  getTemplates() {
    return Object.values(WORKFLOW_TEMPLATES);
  }

  @Get('templates/:id')
  getTemplateById(@Param('id') id: string) {
    const template =
      WORKFLOW_TEMPLATES[id.toUpperCase()] ||
      Object.values(WORKFLOW_TEMPLATES).find((t) => t.id === id);
    return template || null;
  }

  @Post('generate')
  async generateWorkflow(@Body() dto: GenerateWorkflowDto) {
    const mockUserId = 'user_mvp_1'; // Replace with req.user.id
    return this.generatorService.generateWorkflow(dto, mockUserId);
  }

  @Post('setup-requirements')
  async getSetupRequirements(
    @Body() graphPayload: { graph: { nodes: any[]; edges: any[] } },
    @Query('userId') userId?: string,
  ) {
    const targetUserId = userId || 'user_mvp_1';
    return this.setupRequirementService.analyzeRequirements(
      graphPayload.graph,
      targetUserId,
    );
  }
}
