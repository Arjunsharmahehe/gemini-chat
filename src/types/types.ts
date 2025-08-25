export type MessageType = {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date | string;
  model?: string;
  mode?: string;
  thoughts?: string;
}

export type ConfigType = {
  responseMimeType: string;
  thinkingConfig?: {
    includeThoughts: boolean; // Optional, default is false
    thinkingBudget: number;
  };
  systemInstruction: [
    {
        text: string
    }
  ]
}