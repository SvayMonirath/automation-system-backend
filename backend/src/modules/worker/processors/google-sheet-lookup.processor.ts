import { Injectable, Logger } from '@nestjs/common';
import {
  INodeProcessor,
  NodeExecutionContext,
  NodeExecutionOutput,
} from '../interfaces/processor.interface';

/*
This processor handles row searches against Google Sheets using OAuth tokens supplied via context credentials.
*/

@Injectable()
export class GoogleSheetLookupProcessor implements INodeProcessor {
  private readonly logger = new Logger(GoogleSheetLookupProcessor.name);

  async execute(ctx: NodeExecutionContext): Promise<NodeExecutionOutput> {
    this.logger.log(`[Node: ${ctx.nodeId}] Querying Google Sheets row...`);

    const searchValue = ctx.nodeInputs?.searchValue;
    const spreadsheetId = ctx.params?.spreadsheetId;
    const sheetName = ctx.params?.sheetName || 'Sheet1';
    const lookupColumn = ctx.params?.lookupColumn;

    if (!searchValue || !spreadsheetId || !lookupColumn) {
      return {
        success: false,
        error: {
          code: 'MISSING_PARAMETERS',
          message:
            'Missing required parameters: searchValue, spreadsheetId, or lookupColumn.',
        },
      };
    }

    // Verify presence of injected credential token
    const accessToken = ctx.credentials?.accessToken;
    if (!accessToken) {
      return {
        success: false,
        error: {
          code: 'AUTH_REQUIRED',
          message:
            'Missing valid Google OAuth credential for google_sheets capability.',
        },
      };
    }

    try {
      // Mock lookup simulation (In production, calls Google Sheets v4 API endpoint)
      this.logger.log(
        `Searching sheet "${sheetName}" in doc ${spreadsheetId} where ${lookupColumn} == ${searchValue}`,
      );
      const mockFoundRow = {
        id: '101',
        product: searchValue,
        stock: 12,
        price: '$29.99',
      };

      return {
        success: true,
        data: {
          found: true,
          rowData: mockFoundRow,
        },
      };
    } catch (err: any) {
      this.logger.error(
        `Google Sheet lookup failed: ${err.message}`,
        err.stack,
      );
      return {
        success: false,
        error: {
          code: 'SHEET_LOOKUP_ERROR',
          message: err.message || 'Failed to query Google Sheet.',
        },
      };
    }
  }
}
