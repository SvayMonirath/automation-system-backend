import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ValidationService } from '../validation/validation.service';
import { PromptBuilderService } from './services/prompt-builder.service';
import { WORKFLOW_TEMPLATES } from './constants/templates.constant';

export interface GenerateWorkflowDto {
  businessDescription: string;
  preferredTemplateId?: string;
}

@Injectable()
export class WorkflowGeneratorService {
  private readonly logger = new Logger(WorkflowGeneratorService.name);

  constructor(
    private readonly validationService: ValidationService,
    private readonly promptBuilder: PromptBuilderService,
  ) {}

  async generateWorkflow(
    dto: GenerateWorkflowDto,
    userId: string,
  ): Promise<any> {
    this.logger.log(`Generating workflow for user ${userId}...`);

    let candidateGraph: any;

    // 1. If template matching is requested or applicable
    if (
      dto.preferredTemplateId &&
      WORKFLOW_TEMPLATES[dto.preferredTemplateId]
    ) {
      candidateGraph = JSON.parse(
        JSON.stringify(WORKFLOW_TEMPLATES[dto.preferredTemplateId]),
      );
    } else {
      // 2. Default fallback or LLM generation (using Customer Support Assistant default for MVP)
      candidateGraph = JSON.parse(
        JSON.stringify(WORKFLOW_TEMPLATES.CUSTOMER_SUPPORT_ASSISTANT),
      );
      candidateGraph.name = `Auto-generated: ${dto.businessDescription.slice(0, 30)}...`;
    }

    // 3. Task 35: Deterministic Gatekeeper Validation Loop
    const validationResult = await this.validationService.validateGraph(
      candidateGraph.graph,
      userId,
    );

    if (!validationResult.isValid) {
      this.logger.warn(
        `AI generated an invalid graph: ${JSON.stringify(validationResult.errors)}`,
      );
      // Here an LLM retry loop passes validation errors back to prompt for auto-correction
      throw new BadRequestException({
        message: 'Generated workflow failed deterministic validation rules.',
        validationErrors: validationResult.errors,
      });
    }

    return {
      name: candidateGraph.name,
      description: candidateGraph.description,
      graph: candidateGraph.graph,
      validation: validationResult,
    };
  }
}
