import { IChatRepository, IVectorRepository } from '@/domain/repositories/interfaces';
import { ChatMessage } from '@/domain/entities/chat';

const MAX_HISTORY_MESSAGES = 6; // Keep last 6 messages to save tokens
const MAX_CONTEXT_CHUNKS = 5;   // Limit CV context chunks
const MAX_USER_MESSAGE_LENGTH = 1000; // Max user message length

export class GetChatResponseUseCase {
    constructor(
        private chatRepository: IChatRepository,
        private vectorRepository: IVectorRepository
    ) { }

    async execute(chatHistory: ChatMessage[], userMessage: string): Promise<string> {
        // Limit user message length (max 1000 chars)
        const truncatedMessage = userMessage.slice(0, MAX_USER_MESSAGE_LENGTH);

        // Limit chat history to last N messages
        const limitedHistory = chatHistory.slice(-MAX_HISTORY_MESSAGES);

        // 1. Search for relevant CV context (limited)
        const relevantContext = await this.vectorRepository.searchSimilar(truncatedMessage, MAX_CONTEXT_CHUNKS);

        // 2. Combine history and context to get response from AI
        const response = await this.chatRepository.getChatResponse(
            [...limitedHistory, { id: Date.now().toString(), role: 'user', content: truncatedMessage, createdAt: new Date() }],
            relevantContext
        );

        return response;
    }
}
