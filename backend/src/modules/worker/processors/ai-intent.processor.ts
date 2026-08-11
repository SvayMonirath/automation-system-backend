import { Injectable, Logger } from '@nestjs/common';
import {
  INodeProcessor,
  NodeExecutionContext,
  NodeExecutionOutput,
} from '../interfaces/processor.interface';

/*
This processor calls the AI layer to classify incoming user
message text into pre-configured intent categories.
*/

@Injectable()
export class AiIntentProcessor implements INodeProcessor {
  private readonly logger = new Logger(AiIntentProcessor.name);

  async execute(ctx: NodeExecutionContext): Promise<NodeExecutionOutput> {
    this.logger.log(
      `[Node: ${ctx.nodeId}] Evaluating AI Intent Classification...`,
    );

    const textToAnalyze = ctx.nodeInputs?.text;
    const possibleIntents = ctx.params?.possibleIntents;

    if (!textToAnalyze) {
      return {
        success: false,
        error: {
          code: 'MISSING_INPUT',
          message: 'Missing required input "text" for AI Intent Processor.',
        },
      };
    }

    if (
      !possibleIntents ||
      !Array.isArray(possibleIntents) ||
      possibleIntents.length === 0
    ) {
      return {
        success: false,
        error: {
          code: 'INVALID_CONFIG',
          message:
            'Parameter "possibleIntents" must be a non-empty array of intent labels.',
        },
      };
    }

    try {
      // Mock / Rule-based fallback classification until OpenAI/Gemini SDK is injected
      const normalizedText = String(textToAnalyze).toLowerCase();
      let detectedIntent = possibleIntents[possibleIntents.length - 1]; // Default to last/fallback
      let confidence = 0.75;

      for (const intent of possibleIntents) {
        const intentKey = String(intent).toLowerCase();
        if (normalizedText.includes(intentKey)) {
          detectedIntent = intent;
          confidence = 0.95;
          break;
        }
      }

      return {
        success: true,
        data: {
          intent: detectedIntent,
          confidence,
          extractedEntities: {
            rawQuery: textToAnalyze,
            matchedKeyword: detectedIntent,
          },
        },
      };
    } catch (err: any) {
      this.logger.error(
        `AI Intent processing failed: ${err.message}`,
        err.stack,
      );
      return {
        success: false,
        error: {
          code: 'AI_PROCESSING_ERROR',
          message:
            err.message || 'Error occurred during AI Intent classification.',
        },
      };
    }
  }
}
