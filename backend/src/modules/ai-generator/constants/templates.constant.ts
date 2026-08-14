export interface WorkflowTemplate {
  id: string;
  name: string;
  category: 'SUPPORT' | 'INVENTORY' | 'NOTIFICATION' | 'LEADS';
  description: string;
  graph: {
    nodes: Array<{
      id: string;
      type: string;
      label: string;
      params?: Record<string, any>;
      inputs?: Record<string, any>;
    }>;
    edges: Array<{
      source: string;
      target: string;
      condition?: string;
    }>;
  };
}

export const WORKFLOW_TEMPLATES: Record<string, WorkflowTemplate> = {
  CUSTOMER_SUPPORT_ASSISTANT: {
    id: 'customer-support-assistant',
    name: 'Customer Support & Product Assistant',
    category: 'SUPPORT',
    description:
      'Auto-answers customer product and stock questions via Telegram by searching Google Sheets.',
    graph: {
      nodes: [
        {
          id: 'node_1',
          type: 'telegram_trigger',
          label: 'Incoming Telegram Message',
        },
        {
          id: 'node_2',
          type: 'ai_intent',
          label: 'Classify User Query',
          inputs: { text: '{{telegram_trigger.messageText}}' },
          params: { possibleIntents: ['PRODUCT_INQUIRY', 'GREETING', 'OTHER'] },
        },
        {
          id: 'node_3',
          type: 'ai_extraction',
          label: 'Extract Product Details',
          inputs: { text: '{{telegram_trigger.messageText}}' },
          params: { fields: ['product', 'size'] },
        },
        {
          id: 'node_4',
          type: 'google_sheet_lookup',
          label: 'Lookup Inventory Row',
          inputs: { searchValue: '{{node_3.extractedFields.product}}' },
          params: { sheetName: 'Products', lookupColumn: 'ProductName' },
        },
        {
          id: 'node_5',
          type: 'ai_response',
          label: 'Generate Helpful Reply',
          inputs: { context: '{{node_4.rowData}}' },
          params: {
            promptTemplate:
              'Inform customer about the product stock availability politely: {{context}}',
          },
        },
        {
          id: 'node_6',
          type: 'telegram_reply',
          label: 'Send Reply to Customer',
          inputs: {
            chatId: '{{telegram_trigger.chatId}}',
            message: '{{node_5.response}}',
          },
        },
      ],
      edges: [
        { source: 'node_1', target: 'node_2' },
        { source: 'node_2', target: 'node_3' },
        { source: 'node_3', target: 'node_4' },
        { source: 'node_4', target: 'node_5' },
        { source: 'node_5', target: 'node_6' },
      ],
    },
  },
};
