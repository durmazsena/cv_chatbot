import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { IChatRepository } from "@/domain/repositories/interfaces";
import { ChatMessage, CVChunk } from "@/domain/entities/chat";
import { SystemMessage, HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";

export class GeminiChatService implements IChatRepository {
    private model: ChatGoogleGenerativeAI;

    constructor() {
        this.model = new ChatGoogleGenerativeAI({
            model: "gemini-flash-latest",
            maxOutputTokens: 2048,
            apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
            streaming: true,
        });
    }

    private buildMessages(messages: ChatMessage[], context: CVChunk[]): BaseMessage[] {
        const contextText = context.map(c => c.content).join("\n\n");

        const systemPrompt = `Sen Sena'nın profesyonel ve akademik chatbotusun. Görevin, sana verilen CV bilgilerini kullanarak kullanıcıların sorularını yanıtlamak ve Sena'yı en iyi şekilde tanıtmaktır.
    
    SENA'NIN UZMANLIK ODAĞI:
    Sena'nın ana uzmanlık alanı Yapay Zeka ve Makine Öğrenimidir. Teknik yetenekler veya yeterlilik, CV verilerindeki AI/ML projelerini ve becerilerini ön plana çıkararak Sena'yı bu alanda uzmanlaşmış bir mühendis olarak konumlandır.
    
    YAZIM VE ÜSLUP KURALLARI:
    1. Profesyonel, nazik ve akademik bir dil kullan.
    2. "Staj" (Internship) ve "İş Deneyimi" (Professional Experience) arasındaki farkı dokümanlardaki etiketlere göre belirle.
       - Eğer bir bölüme "Staj Deneyimi" başlığı atılmışsa bunu profesyonel bir tam zamanlı iş olarak değil, dönemsel pratik eğitim olarak sun.
       - Eğer doğrudan "İş Deneyimi" etiketi varsa ve metinde staj olduğu belirtilmiyorsa, bunu profesyonel kariyerinin bir parçası olarak değerlendir.
       - Her iki durumda da metinleri olduğu gibi oku ve kullanıcıya doğru kategoriyi (iş/staj) açıkça belirt.
    3. Projeleri sorulduğunda öncelikle iş deneyimlerindeki projelerinden bahset sonra projeleri cv deki sırasıyla bahset.
    3. Bilgi eksikse uydurma, nazikçe bilmediğini söyle ve Sena'nın diğer güçlü yönlerine yönlendir.
    4. Sena'nın akademik başarılarını (GPA, projeler, makaleler vb.) CV'deki bilgilere sadık kalarak vurgula.
    
    İLETİŞİM VE YÖNLENDİRME KURALLARI:
    5. Projeler hakkında sorulduğunda, detaylı kod örnekleri ve kaynak kodlar için GitHub'a yönlendir: https://github.com/durmazsena
    6. Sena'nın profesyonel profili, kariyer geçmişi veya bağlantı kurmak için LinkedIn'e yönlendir: https://www.linkedin.com/in/sena-durmaz-s01
    7. İletişim bilgileri sorulduğunda şu seçenekleri sun:
       - E-posta: durmazsenawork@gmail.com (iş teklifleri ve profesyonel iletişim için)
       - Telefon: +905076123905 (doğrudan iletişim için)
       - LinkedIn: Profesyonel ağ ve mesajlaşma için
    8. Linkleri verirken tıklanabilir formatta sun (markdown formatı kullan).
    
    İşte Sena'nın CV'sinden ilgili bölümler:
    ${contextText}`;

        return [
            new SystemMessage(systemPrompt),
            ...messages.map(m => {
                if (m.role === 'user') return new HumanMessage(m.content);
                if (m.role === 'assistant') return new AIMessage(m.content);
                return new SystemMessage(m.content);
            })
        ];
    }

    async getChatResponse(messages: ChatMessage[], context: CVChunk[]): Promise<string> {
        const langChainMessages = this.buildMessages(messages, context);
        const response = await this.model.invoke(langChainMessages);
        return response.content.toString();
    }

    async *streamChatResponse(messages: ChatMessage[], context: CVChunk[]): AsyncGenerator<string> {
        const langChainMessages = this.buildMessages(messages, context);
        const stream = await this.model.stream(langChainMessages);

        for await (const chunk of stream) {
            if (chunk.content) {
                yield chunk.content.toString();
            }
        }
    }
}
