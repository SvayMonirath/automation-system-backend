import { ConnectorSpec } from '../interfaces/registry.interface';

export const CONNECTOR_REGISTRY: Record<string, ConnectorSpec> = {
  telegram: {
    type: 'telegram',
    name: 'Telegram',
    description: 'Telegram Bot API integration for triggers and messaging.',
    authType: 'BOT_TOKEN',
    capabilities: ['telegram:receive_message', 'telegram:send_message'],
  },
  google_sheets: {
    type: 'google_sheets',
    name: 'Google Sheets',
    description: 'Read and query spreadsheet records.',
    authType: 'OAUTH2',
    capabilities: ['google_sheets:read_row'],
  },
  gmail: {
    type: 'gmail',
    name: 'Gmail',
    description: 'Send notifications and email updates via Gmail API.',
    authType: 'OAUTH2',
    capabilities: ['gmail:send_email'],
  },
};
