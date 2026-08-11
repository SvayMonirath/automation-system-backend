import { Injectable, Logger } from '@nestjs/common';
import {
  INodeProcessor,
  NodeExecutionContext,
  NodeExecutionOutput,
} from '../interfaces/processor.interface';

/*
This processor evaluates boolean logic rules (e.g., EQUALS, NOT_EQUALS, CONTAINS, GREATER_THAN)
against upstream inputs to determine graph branching execution.
*/

@Injectable()
export class IfConditionProcessor implements INodeProcessor {
  private readonly logger = new Logger(IfConditionProcessor.name);

  async execute(ctx: NodeExecutionContext): Promise<NodeExecutionOutput> {
    this.logger.log(`[Node: ${ctx.nodeId}] Evaluating IF Condition...`);

    const valueA = ctx.nodeInputs?.valueA;
    const valueB = ctx.nodeInputs?.valueB ?? ctx.params?.targetValue;
    const operator = ctx.params?.operator || 'EQUALS';

    if (valueA === undefined) {
      return {
        success: false,
        error: {
          code: 'MISSING_INPUT',
          message:
            'Missing required input "valueA" for IF condition evaluation.',
        },
      };
    }

    let result = false;

    switch (operator.toUpperCase()) {
      case 'EQUALS':
        result = String(valueA) === String(valueB);
        break;
      case 'NOT_EQUALS':
        result = String(valueA) !== String(valueB);
        break;
      case 'CONTAINS':
        result = String(valueA)
          .toLowerCase()
          .includes(String(valueB).toLowerCase());
        break;
      case 'GREATER_THAN':
        result = Number(valueA) > Number(valueB);
        break;
      case 'LESS_THAN':
        result = Number(valueA) < Number(valueB);
        break;
      default:
        return {
          success: false,
          error: {
            code: 'INVALID_OPERATOR',
            message: `Unsupported condition operator: ${operator}`,
          },
        };
    }

    return {
      success: true,
      data: {
        result,
        branch: result ? 'true' : 'false',
        evaluated: { valueA, operator, valueB },
      },
    };
  }
}
