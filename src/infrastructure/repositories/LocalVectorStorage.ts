import { IVectorRepository } from "@/domain/repositories/interfaces";
import { CVChunk } from "@/domain/entities/chat";

export class LocalVectorStorage implements IVectorRepository {
    private chunks: CVChunk[] = [];

    constructor() { }

    async saveChunks(chunks: CVChunk[]): Promise<void> {
        this.chunks = chunks;
    }

    async searchSimilar(query: string, limit: number = 8): Promise<CVChunk[]> {
        if (this.chunks.length === 0) return [];

        // Keyword-based search as fallback (Netlify serverless friendly)
        const queryLower = query.toLowerCase();
        const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

        const scoredChunks = this.chunks.map(chunk => {
            let score = 0;
            const contentLower = chunk.content.toLowerCase();

            // Score based on keyword matches
            for (const word of queryWords) {
                if (contentLower.includes(word)) {
                    score += 1;
                }
            }

            // Boost based on metadata keywords
            if (chunk.metadata?.keywords) {
                for (const keyword of chunk.metadata.keywords) {
                    if (queryLower.includes(keyword.toLowerCase())) {
                        score += 2;
                    }
                }
            }

            // Section-based boosting
            if (chunk.metadata?.section === "Work Experience") {
                if (queryLower.includes("iş") || queryLower.includes("deneyim") || queryLower.includes("çalış")) {
                    score += 3;
                }
            }

            if (chunk.metadata?.section === "Skills") {
                if (queryLower.includes("yetenek") || queryLower.includes("teknik") || queryLower.includes("beceri")) {
                    score += 3;
                }
            }

            if (chunk.metadata?.section === "Projects") {
                if (queryLower.includes("proje") || queryLower.includes("geliştir") || queryLower.includes("yaptı")) {
                    score += 3;
                }
            }

            if (chunk.metadata?.section === "Contact") {
                if (queryLower.includes("iletişim") || queryLower.includes("mail") || queryLower.includes("telefon") || queryLower.includes("linkedin") || queryLower.includes("github")) {
                    score += 5;
                }
            }

            if (chunk.metadata?.section === "Internships") {
                if (queryLower.includes("staj")) {
                    score += 3;
                }
            }

            // Priority boost
            if (chunk.metadata?.priority === "high") {
                score *= 1.5;
            }

            // Internship context penalty
            if (chunk.metadata?.context === "internship") {
                score *= 0.8;
            }

            return { chunk, score };
        });

        return scoredChunks
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(item => item.chunk);
    }
}
