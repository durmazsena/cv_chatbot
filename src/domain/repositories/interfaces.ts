import { ChatMessage, CVChunk } from '../entities/chat';

export interface IChatRepository {
    getChatResponse(messages: ChatMessage[], context: CVChunk[]): Promise<string>;
}

export interface IVectorRepository {
    searchSimilar(query: string, limit?: number): Promise<CVChunk[]>;
    saveChunks(chunks: CVChunk[]): Promise<void>;
}
