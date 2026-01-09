import { NextResponse } from 'next/server';
import { ServiceRegistry } from '@/infrastructure/ServiceRegistry';
import { ChatMessage } from '@/domain/entities/chat';
import { isContentSafe, PROFANITY_WARNING_MESSAGE } from '@/utils/safetyChecker';

const MAX_MESSAGE_LENGTH = 1000;

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

        // GÜVENLİK 1: Karakter Limiti Kontrolü
        if (userMessage.length > MAX_MESSAGE_LENGTH) {
            return NextResponse.json(
                { error: 'Mesajınız çok uzun. Lütfen biraz kısaltıp tekrar deneyin.' },
                { status: 400 }
            );
        }

        // GÜVENLİK 2: Küfür Filtresi (Maliyet Tasarrufu - AI'a göndermeden engelle)
        if (!isContentSafe(userMessage)) {
            return NextResponse.json(
                { response: PROFANITY_WARNING_MESSAGE },
                { status: 200 } // 200 dönüyoruz ki frontend hata sanmasın
            );
        }

        const useCase = await ServiceRegistry.getGetChatResponseUseCase();

        console.time('OpenAI Check');
        const response = await useCase.execute(messages as ChatMessage[], userMessage);
        console.timeEnd('OpenAI Check');

        return NextResponse.json({ response });
    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json({
            error: 'Something went wrong',
            details: error.message || 'Unknown error'
        }, { status: 500 });
    }
}
