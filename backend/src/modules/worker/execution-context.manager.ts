import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ExecutionContextManager {
  private readonly logger = new Logger(ExecutionContextManager.name);

  /**
   * Resolves mustache-style syntax or variable references (e.g., {{trigger.chatId}} or {{node_1.extractedFields.product}})
   * against accumulated execution context data.
   */
  resolveInputs(
    inputSchema: Record<string, any>,
    accumulatedContext: Record<string, any>,
  ): Record<string, any> {
    if (!inputSchema) return {};

    const resolvedInputs: Record<string, any> = {};

    for (const [key, rawValue] of Object.entries(inputSchema)) {
      if (typeof rawValue === 'string') {
        resolvedInputs[key] = this.interpolateValue(
          rawValue,
          accumulatedContext,
        );
      } else if (typeof rawValue === 'object' && rawValue !== null) {
        resolvedInputs[key] = this.resolveInputs(rawValue, accumulatedContext);
      } else {
        resolvedInputs[key] = rawValue;
      }
    }

    return resolvedInputs;
  }

  private interpolateValue(value: string, context: Record<string, any>): any {
    const match = value.match(/^\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}$/);
    if (match) {
      // Exact single path reference, return raw value preserves type (object, number, boolean)
      return this.getValueByPath(context, match[1]);
    }

    // String template interpolation (e.g. "Hello {{user.name}}")
    return value.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_, path) => {
      const resolved = this.getValueByPath(context, path);
      return resolved !== undefined && resolved !== null
        ? String(resolved)
        : '';
    });
  }

  private getValueByPath(obj: Record<string, any>, path: string): any {
    return path
      .split('.')
      .reduce(
        (acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined),
        obj,
      );
  }

  /**
   * Merges node output payload into accumulated context data state.
   */
  mergeOutput(
    accumulatedContext: Record<string, any>,
    nodeId: string,
    nodeType: string,
    outputData: Record<string, any>,
  ): Record<string, any> {
    return {
      ...accumulatedContext,
      [nodeId]: outputData,
      [nodeType]: outputData, // Convenience shorthand for immediate upstream reference
      lastNodeOutput: outputData,
    };
  }
}
