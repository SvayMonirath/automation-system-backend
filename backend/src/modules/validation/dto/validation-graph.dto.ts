import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

export class ValidateGraphDto {
  @ApiProperty({
    example: {
      nodes: [
        { id: 'node_1', type: 'telegram_trigger', params: {} },
        {
          id: 'node_2',
          type: 'ai_intent',
          params: { possibleIntents: ['pricing'] },
        },
      ],
      connections: [{ source: 'node_1', target: 'node_2' }],
    },
  })
  @IsObject()
  @IsNotEmpty()
  definition: Record<string, any>;
}
