import { IChatRepository, IVectorRepository } from '@/domain/repositories/interfaces';
import { ChatMessage } from '@/domain/entities/chat';

export class GetChatResponseUseCase {
    constructor(
        private chatRepository: IChatRepository,
        private vectorRepository: IVectorRepository
    ) { }

    async execute(chatHistory: ChatMessage[], userMessage: string): Promise<string> {
        // 1. Search for relevant CV context
        const relevantContext = await this.vectorRepository.searchSimilar(userMessage);

        // 2. Combine history and context to get response from AI
        const response = await this.chatRepository.getChatResponse(
            [...chatHistory, { id: Date.now().toString(), role: 'user', content: userMessage, createdAt: new Date() }],
            relevantContext
        );

        return response;
    }
}
