import { ServiceRegistry } from '@/infrastructure/ServiceRegistry';
import { ChatMessage } from '@/domain/entities/chat';

export async function POST(req: Request) {
    try {
        const { messages, userMessage } = await req.json();

        if (!userMessage) {
            return new Response(JSON.stringify({ error: 'Message is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get context from vector storage
        const vectorRepository = await ServiceRegistry.getVectorRepository();
        const context = await vectorRepository.searchSimilar(userMessage);

        // Get chat service for streaming
        const chatService = ServiceRegistry.getChatService();
        const allMessages: ChatMessage[] = [
            ...messages,
            { id: Date.now().toString(), role: 'user', content: userMessage, createdAt: new Date() }
        ];

        // Create streaming response
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of chatService.streamChatResponse(allMessages, context)) {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
                    }
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error: any) {
        console.error('Chat API Error:', error);
        return new Response(JSON.stringify({ error: 'Something went wrong', details: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
