import { IsString, IsObject, IsOptional, IsNotEmpty } from 'class-validator';

export class TriggerWorkflowDto {
  @IsString()
  @IsNotEmpty()
  workflowId: string;

  @IsObject()
  @IsOptional()
  triggerPayload?: Record<string, any>;
}

export class ExecutionResponseDto {
  executionId: string;
  workflowId: string;
  workflowVersionId: string;
  status: string;
  startedAt: string;
}
