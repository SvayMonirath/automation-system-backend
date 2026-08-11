import { Injectable, Logger } from '@nestjs/common';
import {
  INodeProcessor,
  NodeExecutionContext,
  NodeExecutionOutput,
} from '../interfaces/processor.interface';

/*
This processor normalizes incoming Telegram webhook payloads into standard
OPAL outputs (chatId, messageText, senderName).
*/

@Injectable()
export class TelegramTriggerProcessor implements INodeProcessor {
  private readonly logger = new Logger(TelegramTriggerProcessor.name);

  async execute(ctx: NodeExecutionContext): Promise<NodeExecutionOutput> {
    this.logger.log(
      `[Node: ${ctx.nodeId}] Processing Telegram Trigger Payload...`,
    );

    const rawPayload = ctx.nodeInputs?.rawPayload || ctx.nodeInputs;

    if (!rawPayload || !rawPayload.message) {
      return {
        success: false,
        error: {
          code: 'INVALID_PAYLOAD',
          message: 'Missing or malformed Telegram webhook message payload.',
        },
      };
    }

    const message = rawPayload.message;
    const chatId = String(message.chat?.id || '');
    const messageText = message.text || '';
    const senderName =
      [message.from?.first_name, message.from?.last_name]
        .filter(Boolean)
        .join(' ') ||
      message.from?.username ||
      'Unknown Sender';

    return {
      success: true,
      data: {
        chatId,
        messageText,
        senderName,
        timestamp: message.date
          ? new Date(message.date * 1000).toISOString()
          : new Date().toISOString(),
      },
    };
  }
}
