import { NodeSpec, NodeType } from '../interfaces/registry.interface';

export const NODE_REGISTRY: Record<string, NodeSpec> = {
  // =========================================================================
  // CATEGORY 1: GENERAL / CORE UTILITY NODES (Like n8n / Zapier)
  // =========================================================================

  // ----------------------------------------------------
  // G1. TRIGGER: Generic Webhook Trigger
  // ----------------------------------------------------
  webhook_trigger: {
    type: 'webhook_trigger',
    category: NodeType.TRIGGER,
    name: 'Webhook Trigger',
    description:
      'Triggers a workflow when an HTTP POST/GET request is received.',
    inputSchema: {},
    outputSchema: {
      headers: 'json',
      query: 'json',
      body: 'json',
      method: 'string',
    },
    params: [
      {
        key: 'path',
        label: 'Webhook Subpath',
        type: 'string',
        required: true,
        description: 'Unique URL slug to listen on (e.g. /my-custom-webhook).',
      },
      {
        key: 'httpMethod',
        label: 'HTTP Method',
        type: 'select',
        required: true,
        defaultValue: 'POST',
        options: [
          { label: 'POST', value: 'POST' },
          { label: 'GET', value: 'GET' },
        ],
      },
    ],
  },

  // ----------------------------------------------------
  // G2. DATA / ACTION: Generic HTTP Request
  // ----------------------------------------------------
  http_request: {
    type: 'http_request',
    category: NodeType.DATA,
    name: 'HTTP Request',
    description: 'Executes a custom HTTP request to any third-party REST API.',
    inputSchema: {
      url: 'string',
      headers: 'json',
      body: 'json',
    },
    outputSchema: {
      status: 'number',
      data: 'json',
      headers: 'json',
    },
    params: [
      {
        key: 'method',
        label: 'Method',
        type: 'select',
        required: true,
        defaultValue: 'GET',
        options: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'DELETE', value: 'DELETE' },
        ],
      },
      {
        key: 'url',
        label: 'URL Endpoint',
        type: 'string',
        required: true,
      },
    ],
  },

  // ----------------------------------------------------
  // G3. LOGIC: Delay / Wait Node
  // ----------------------------------------------------
  delay: {
    type: 'delay',
    category: NodeType.LOGIC,
    name: 'Delay / Pause',
    description: 'Pauses workflow execution for a specified amount of time.',
    inputSchema: {},
    outputSchema: {
      delayedForSeconds: 'number',
    },
    params: [
      {
        key: 'unit',
        label: 'Time Unit',
        type: 'select',
        required: true,
        defaultValue: 'SECONDS',
        options: [
          { label: 'Seconds', value: 'SECONDS' },
          { label: 'Minutes', value: 'MINUTES' },
          { label: 'Hours', value: 'HOURS' },
        ],
      },
      {
        key: 'amount',
        label: 'Duration',
        type: 'number',
        required: true,
        defaultValue: 5,
      },
    ],
  },

  // ----------------------------------------------------
  // G4. LOGIC: Code / Data Mapper Node
  // ----------------------------------------------------
  code_transform: {
    type: 'code_transform',
    category: NodeType.DATA,
    name: 'Code Transform',
    description:
      'Transforms, parses, or filters incoming node payloads using standard JSON rules.',
    inputSchema: {
      inputData: 'json',
    },
    outputSchema: {
      result: 'json',
    },
    params: [
      {
        key: 'expression',
        label: 'Transformation Mapping',
        type: 'json',
        required: true,
        description:
          'Key-value map defining property extractions from runtime context.',
      },
    ],
  },

  // =========================================================================
  // CATEGORY 2: SCENARIO & AI INTEGRATION NODES (OPAL Domain)
  // =========================================================================

  // ----------------------------------------------------
  // S1. TRIGGER: Telegram Message
  // ----------------------------------------------------
  telegram_trigger: {
    type: 'telegram_trigger',
    category: NodeType.TRIGGER,
    name: 'Telegram Message Trigger',
    description: 'Triggers workflow when a message is received via Telegram.',
    requiredCapability: 'telegram:receive_message',
    inputSchema: {},
    outputSchema: {
      chatId: 'string',
      messageText: 'string',
      senderName: 'string',
    },
    params: [],
  },

  // ----------------------------------------------------
  // S2. AI: Intent Understanding
  // ----------------------------------------------------
  ai_intent: {
    type: 'ai_intent',
    category: NodeType.AI,
    name: 'AI Intent Understanding',
    description:
      'Analyzes user text to extract underlying intent and parameters.',
    inputSchema: {
      text: 'string',
    },
    outputSchema: {
      intent: 'string',
      confidence: 'number',
      extractedEntities: 'json',
    },
    params: [
      {
        key: 'possibleIntents',
        label: 'Possible Intents',
        type: 'json',
        required: true,
        description:
          'Array of intent labels for the model to classify against.',
      },
    ],
  },

  // ----------------------------------------------------
  // S3. AI: Information Extraction
  // ----------------------------------------------------
  ai_extraction: {
    type: 'ai_extraction',
    category: NodeType.AI,
    name: 'AI Information Extraction',
    description:
      'Extracts structured parameters (e.g. product names, sizes, quantities) from raw text.',
    inputSchema: {
      text: 'string',
    },
    outputSchema: {
      extractedFields: 'json',
    },
    params: [
      {
        key: 'schemaToExtract',
        label: 'Extraction Schema',
        type: 'json',
        required: true,
        description: 'JSON schema describing target keys to extract.',
      },
    ],
  },

  // ----------------------------------------------------
  // S4. AI: Response Generation
  // ----------------------------------------------------
  ai_response: {
    type: 'ai_response',
    category: NodeType.AI,
    name: 'AI Response Generation',
    description:
      'Generates natural human replies using context provided by upstream data nodes.',
    inputSchema: {
      promptContext: 'json',
      userQuery: 'string',
    },
    outputSchema: {
      generatedText: 'string',
    },
    params: [
      {
        key: 'systemPrompt',
        label: 'System Persona / Instructions',
        type: 'string',
        required: false,
        defaultValue: 'You are a polite business assistant.',
      },
    ],
  },

  // ----------------------------------------------------
  // S5. DATA: Google Sheet Lookup
  // ----------------------------------------------------
  google_sheet_lookup: {
    type: 'google_sheet_lookup',
    category: NodeType.DATA,
    name: 'Google Sheet Lookup',
    description: 'Searches a Google Sheet row matching a specific lookup key.',
    requiredCapability: 'google_sheets:read_row',
    inputSchema: {
      searchValue: 'string',
    },
    outputSchema: {
      found: 'boolean',
      rowData: 'json',
    },
    params: [
      {
        key: 'spreadsheetId',
        label: 'Spreadsheet ID',
        type: 'string',
        required: true,
      },
      {
        key: 'sheetName',
        label: 'Sheet Name',
        type: 'string',
        required: true,
      },
      {
        key: 'lookupColumn',
        label: 'Lookup Column',
        type: 'string',
        required: true,
      },
    ],
  },

  // ----------------------------------------------------
  // S6. LOGIC: IF Condition
  // ----------------------------------------------------
  if_condition: {
    type: 'if_condition',
    category: NodeType.LOGIC,
    name: 'IF Condition',
    description: 'Evaluates logical rules to route graph execution.',
    inputSchema: {
      valueA: 'any',
      valueB: 'any',
    },
    outputSchema: {
      result: 'boolean',
    },
    params: [
      {
        key: 'operator',
        label: 'Operator',
        type: 'select',
        required: true,
        defaultValue: 'EQUALS',
        options: [
          { label: 'Equals', value: 'EQUALS' },
          { label: 'Not Equals', value: 'NOT_EQUALS' },
          { label: 'Contains', value: 'CONTAINS' },
        ],
      },
    ],
  },

  // ----------------------------------------------------
  // S7. ACTION: Telegram Reply
  // ----------------------------------------------------
  telegram_reply: {
    type: 'telegram_reply',
    category: NodeType.ACTION,
    name: 'Telegram Reply',
    description: 'Sends a reply message back to a Telegram chat.',
    requiredCapability: 'telegram:send_message',
    inputSchema: {
      chatId: 'string',
      message: 'string',
    },
    outputSchema: {
      sent: 'boolean',
      messageId: 'string',
    },
    params: [],
  },

  // ----------------------------------------------------
  // S8. ACTION: Email Notification
  // ----------------------------------------------------
  email_notification: {
    type: 'email_notification',
    category: NodeType.ACTION,
    name: 'Email Notification',
    description: 'Sends an email notification via Gmail.',
    requiredCapability: 'gmail:send_email',
    inputSchema: {
      recipient: 'string',
      subject: 'string',
      body: 'string',
    },
    outputSchema: {
      success: 'boolean',
    },
    params: [],
  },
};
