import { Injectable, Logger } from '@nestjs/common';
import {
  INodeProcessor,
  NodeExecutionContext,
  NodeExecutionOutput,
} from '../interfaces/processor.interface';

/*
This processor formats natural language replies by incorporating
upstream context data (such as information returned from a
database lookup or extraction step) into a structured prompt output.
*/

@Injectable()
export class AiResponseProcessor implements INodeProcessor {
  private readonly logger = new Logger(AiResponseProcessor.name);

  async execute(ctx: NodeExecutionContext): Promise<NodeExecutionOutput> {
    this.logger.log(`[Node: ${ctx.nodeId}] Generating AI Response...`);

    const promptTemplate =
      ctx.params?.promptTemplate ||
      'Here is the requested information: {{context}}';
    const upstreamContext = ctx.nodeInputs?.context || ctx.contextData;

    try {
      // Formats response using available context.
      // Note: Live LLM SDK call (Gemini/OpenAI) replaces this mock string replacement in Phase 6.
      let responseText = promptTemplate;

      if (typeof upstreamContext === 'object') {
        responseText = `${promptTemplate} \nData: ${JSON.stringify(upstreamContext)}`;
      } else if (upstreamContext) {
        responseText = promptTemplate.replace(
          '{{context}}',
          String(upstreamContext),
        );
      }

      return {
        success: true,
        data: {
          response: responseText,
          generatedAt: new Date().toISOString(),
        },
      };
    } catch (err: any) {
      this.logger.error(
        `AI Response generation failed: ${err.message}`,
        err.stack,
      );
      return {
        success: false,
        error: {
          code: 'RESPONSE_GENERATION_FAILED',
          message: err.message || 'Failed to generate AI response.',
        },
      };
    }
  }
}
