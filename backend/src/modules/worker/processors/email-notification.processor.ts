import { Injectable, Logger } from '@nestjs/common';
import {
  INodeProcessor,
  NodeExecutionContext,
  NodeExecutionOutput,
} from '../interfaces/processor.interface';

/*
This processor sends notification emails via Gmail OAuth tokens
or SMTP credentials provided in the execution context.
*/

@Injectable()
export class EmailNotificationProcessor implements INodeProcessor {
  private readonly logger = new Logger(EmailNotificationProcessor.name);

  async execute(ctx: NodeExecutionContext): Promise<NodeExecutionOutput> {
    this.logger.log(`[Node: ${ctx.nodeId}] Executing Email Notification...`);

    const recipient = ctx.nodeInputs?.recipient || ctx.params?.defaultRecipient;
    const subject =
      ctx.nodeInputs?.subject ||
      ctx.params?.subject ||
      'OPAL Automated Notification';
    const body =
      ctx.nodeInputs?.body ||
      ctx.contextData?.response ||
      ctx.nodeInputs?.message;

    if (!recipient || !body) {
      return {
        success: false,
        error: {
          code: 'MISSING_INPUT',
          message:
            'Missing required fields: "recipient" or "body" for email notification.',
        },
      };
    }

    const accessToken = ctx.credentials?.accessToken;
    if (!accessToken) {
      return {
        success: false,
        error: {
          code: 'AUTH_REQUIRED',
          message:
            'Missing valid OAuth credential for gmail:send_email capability.',
        },
      };
    }

    try {
      // Mock API call simulation (Production replaces this with Gmail REST API / Nodemailer integration)
      this.logger.log(`Sending Email to ${recipient} | Subject: "${subject}"`);

      return {
        success: true,
        data: {
          success: true,
          recipient,
          subject,
          sentAt: new Date().toISOString(),
        },
      };
    } catch (err: any) {
      this.logger.error(`Email delivery failed: ${err.message}`, err.stack);
      return {
        success: false,
        error: {
          code: 'EMAIL_SEND_ERROR',
          message: err.message || 'Failed to dispatch email notification.',
        },
      };
    }
  }
}
