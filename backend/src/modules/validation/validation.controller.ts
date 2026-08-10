import { Controller, Post, Body, Request } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ValidationService } from './validation.service';
import { ValidateGraphDto } from './dto/validate-graph.dto';

@ApiTags('Validation')
@Controller('validation')
export class ValidationController {
  constructor(private readonly validationService: ValidationService) {}

  private getUserId(req: any): string {
    return req.user?.id || 'mock-user-id';
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a workflow graph definition server-side' })
  validateGraph(@Request() req: any, @Body() dto: ValidateGraphDto) {
    return this.validationService.validateWorkflowGraph(
      this.getUserId(req),
      dto.definition,
    );
  }
}
