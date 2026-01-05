export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
}

export interface CVChunk {
  id: string;
  content: string;
  metadata: Record<string, any>;
  embedding?: number[];
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
}
