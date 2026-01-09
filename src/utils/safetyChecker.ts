import { BAD_WORD_ROOTS, RISKY_EXACT_MATCHES } from "./badWords";

/**
 * Metni normalize eder - Türkçe karakterleri ve noktalama işaretlerini temizler
 * Bu sayede "s.a.l.a.k" veya "$alak" gibi hileler yakalanır
 */
function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .replace(/İ/g, "i")
        .replace(/ı/g, "i")
        .replace(/ş/g, "s")
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9]/g, ""); // Noktalama işaretlerini ve boşlukları siler
}

/**
 * Kullanıcı mesajının güvenli olup olmadığını kontrol eder
 * @param message - Kontrol edilecek mesaj
 * @returns true = güvenli, false = uygunsuz içerik
 */
export function isContentSafe(message: string): boolean {
    // 1. Orijinal metni küçük harfe çevir
    const lowerMessage = message.toLowerCase();

    // 2. Kelimeleri boşluklara göre ayır (Tam eşleşme kontrolü için)
    const words = lowerMessage.split(/\s+/);

    // Kural A: Riskli kısa kelimeler (Tam Eşleşme)
    // Örn: "am" engellenir ama "tamam" geçer.
    for (const word of words) {
        if (RISKY_EXACT_MATCHES.includes(word)) {
            return false;
        }
    }

    // Kural B: Kök içeren kelimeler (Partial Match)
    // Örn: "siktir" listesindeyse "siktirgit" de engellenir.
    const normalizedMessage = normalizeText(message);

    for (const badRoot of BAD_WORD_ROOTS) {
        // Normalize edilmiş kökü de kontrol et
        const normalizedRoot = normalizeText(badRoot);

        // Hem normal metinde hem de normalize edilmiş metinde ara
        if (lowerMessage.includes(badRoot) || normalizedMessage.includes(normalizedRoot)) {
            return false;
        }
    }

    return true;
}

// Küfür tespit edildiğinde döndürülecek mesaj
export const PROFANITY_WARNING_MESSAGE =
    "Mesajınız uygunsuz ifadeler içerdiği için yanıtlayamıyorum. Lütfen profesyonel bir dil kullanalım. 😊";
