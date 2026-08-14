import { Injectable, Logger } from '@nestjs/common';

export interface FieldMappingRule {
  sourceField: string; // e.g., "telegram_trigger.chatId" or "ai_extraction.extractedFields.product"
  targetField: string; // e.g., "recipientId" or "searchValue"
  defaultValue?: any;
  transform?: 'LOWERCASE' | 'UPPERCASE' | 'TO_NUMBER' | 'TO_BOOLEAN' | 'TRIM';
}

@Injectable()
export class DataMappingEngine {
  private readonly logger = new Logger(DataMappingEngine.name);

  /**
   * Transforms and maps context outputs into the exact input schema expected by the target node.
   */
  mapData(
    mappingRules: FieldMappingRule[],
    contextData: Record<string, any>,
  ): Record<string, any> {
    const mappedResult: Record<string, any> = {};

    for (const rule of mappingRules) {
      let rawValue = this.extractByPath(contextData, rule.sourceField);

      if (rawValue === undefined || rawValue === null) {
        rawValue = rule.defaultValue;
      }

      if (rawValue !== undefined && rule.transform) {
        rawValue = this.applyTransform(rawValue, rule.transform);
      }

      if (rawValue !== undefined) {
        this.setByPath(mappedResult, rule.targetField, rawValue);
      }
    }

    return mappedResult;
  }

  private extractByPath(obj: Record<string, any>, path: string): any {
    return path
      .split('.')
      .reduce(
        (acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined),
        obj,
      );
  }

  private setByPath(obj: Record<string, any>, path: string, value: any): void {
    const parts = path.split('.');
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part] || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part];
    }

    current[parts[parts.length - 1]] = value;
  }

  private applyTransform(value: any, transform: string): any {
    switch (transform) {
      case 'LOWERCASE':
        return String(value).toLowerCase();
      case 'UPPERCASE':
        return String(value).toUpperCase();
      case 'TRIM':
        return String(value).trim();
      case 'TO_NUMBER':
        const num = Number(value);
        return isNaN(num) ? value : num;
      case 'TO_BOOLEAN':
        return value === 'true' || value === true || value === 1;
      default:
        return value;
    }
  }
}
