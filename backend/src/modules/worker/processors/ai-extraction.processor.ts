import { Injectable, Logger } from '@nestjs/common';
import {
  INodeProcessor,
  NodeExecutionContext,
  NodeExecutionOutput,
} from '../interfaces/processor.interface';

/*
This processor extracts structured JSON entity fields (e.g., product name, size, quantity)
from unstructured user text based on a requested schema.
*/

@Injectable()
export class AiExtractionProcessor implements INodeProcessor {
  private readonly logger = new Logger(AiExtractionProcessor.name);

  async execute(ctx: NodeExecutionContext): Promise<NodeExecutionOutput> {
    this.logger.log(`[Node: ${ctx.nodeId}] Extracting structured entities...`);

    const textToExtract = ctx.nodeInputs?.text;
    const targetFields = ctx.params?.fields || ['product', 'size', 'color'];

    if (!textToExtract) {
      return {
        success: false,
        error: {
          code: 'MISSING_INPUT',
          message: 'Missing required input "text" for entity extraction.',
        },
      };
    }

    try {
      // Basic rule/regex extraction logic (to be replaced by direct LLM structured output / JSON mode)
      const extracted: Record<string, any> = {};
      const words = String(textToExtract).split(' ');

      targetFields.forEach((field: string) => {
        // Fallback placeholder logic for demo execution
        extracted[field] = words.find((w) => w.length > 3) || null;
      });

      return {
        success: true,
        data: {
          extractedFields: extracted,
          rawText: textToExtract,
        },
      };
    } catch (err: any) {
      this.logger.error(`AI Extraction failed: ${err.message}`, err.stack);
      return {
        success: false,
        error: {
          code: 'EXTRACTION_FAILED',
          message: err.message || 'Failed to extract entities from text.',
        },
      };
    }
  }
}
