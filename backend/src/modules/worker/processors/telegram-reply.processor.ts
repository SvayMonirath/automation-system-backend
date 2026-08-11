import { Injectable, Logger } from '@nestjs/common';
import {
  INodeProcessor,
  NodeExecutionContext,
  NodeExecutionOutput,
} from '../interfaces/processor.interface';

/*
This processor handles sending outbound messages to Telegram chats
using Telegram Bot API tokens extracted from context credentials.
*/

@Injectable()
export class TelegramReplyProcessor implements INodeProcessor {
  private readonly logger = new Logger(TelegramReplyProcessor.name);

  async execute(ctx: NodeExecutionContext): Promise<NodeExecutionOutput> {
    this.logger.log(`[Node: ${ctx.nodeId}] Executing Telegram Reply...`);

    const chatId = ctx.nodeInputs?.chatId || ctx.contextData?.chatId;
    const message = ctx.nodeInputs?.message || ctx.contextData?.response;

    if (!chatId || !message) {
      return {
        success: false,
        error: {
          code: 'MISSING_INPUT',
          message:
            'Missing required inputs: "chatId" or "message" for Telegram reply.',
        },
      };
    }

    const botToken = ctx.credentials?.botToken;
    if (!botToken) {
      return {
        success: false,
        error: {
          code: 'AUTH_REQUIRED',
          message:
            'Missing decrypted Telegram botToken credential for telegram:send_message capability.',
        },
      };
    }

    try {
      // Mock API call simulation (Production replaces this with live HTTP POST to https://api.telegram.org/bot<token>/sendMessage)
      this.logger.log(
        `Sending Telegram message to Chat ID ${chatId}: "${message}"`,
      );

      return {
        success: true,
        data: {
          sent: true,
          messageId: `msg_${Date.now()}`,
          chatId,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (err: any) {
      this.logger.error(`Telegram reply failed: ${err.message}`, err.stack);
      return {
        success: false,
        error: {
          code: 'TELEGRAM_API_ERROR',
          message: err.message || 'Failed to deliver Telegram reply message.',
        },
      };
    }
  }
}
