import { NextResponse } from 'next/server';
import { ServiceRegistry } from '@/infrastructure/ServiceRegistry';
import { ChatMessage } from '@/domain/entities/chat';

export async function POST(req: Request) {
    try {
        // Check API key first
        if (!process.env.OPENAI_API_KEY) {
            console.error('OPENAI_API_KEY is not set');
            return NextResponse.json({
                error: 'API configuration error',
                details: 'OPENAI_API_KEY is not configured'
            }, { status: 500 });
        }

        const { messages, userMessage } = await req.json();

        if (!userMessage) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const useCase = await ServiceRegistry.getGetChatResponseUseCase();
        const response = await useCase.execute(messages as ChatMessage[], userMessage);

        return NextResponse.json({ response });
    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Something went wrong', details: error.message }, { status: 500 });
    }
}
