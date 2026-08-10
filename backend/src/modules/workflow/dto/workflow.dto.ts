import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { WorkflowStatus } from '@prisma/client';

export class CreateWorkflowDto {
  @ApiProperty({ example: 'Customer Support Assistant' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Handles Telegram FAQs using Google Sheets and AI.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: {
      nodes: [
        { id: 'node_1', type: 'telegram_trigger', params: {} },
        {
          id: 'node_2',
          type: 'ai_intent',
          params: { possibleIntents: ['pricing', 'hours'] },
        },
      ],
      connections: [{ source: 'node_1', target: 'node_2' }],
    },
  })
  @IsObject()
  @IsOptional()
  definition?: Record<string, any>;
}

export class UpdateWorkflowDraftDto {
  @ApiPropertyOptional({ example: 'Customer Support Assistant v2' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: {
      nodes: [{ id: 'node_1', type: 'telegram_trigger', params: {} }],
      connections: [],
    },
  })
  @IsObject()
  @IsNotEmpty()
  definition: Record<string, any>;
}

export class UpdateWorkflowStatusDto {
  @ApiProperty({ enum: WorkflowStatus, example: WorkflowStatus.ACTIVE })
  @IsEnum(WorkflowStatus)
  status: WorkflowStatus;
}
