import { IVectorRepository } from "@/domain/repositories/interfaces";
import { CVChunk } from "@/domain/entities/chat";
import { pipeline } from "@xenova/transformers";

export class LocalVectorStorage implements IVectorRepository {
    private chunks: CVChunk[] = [];
    private embedder: any = null;

    constructor() { }

    private async getEmbedder() {
        if (!this.embedder) {
            this.embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        }
        return this.embedder;
    }

    async saveChunks(chunks: CVChunk[]): Promise<void> {
        this.chunks = chunks;
    }

    async searchSimilar(query: string, limit: number = 8): Promise<CVChunk[]> {
        if (this.chunks.length === 0) return [];

        // Kullanıcı sorusunu vektöre dönüştür
        const embedder = await this.getEmbedder();
        const output = await embedder(query, { pooling: 'mean', normalize: true });
        const queryEmbedding = Array.from(output.data) as number[];

        const scoredChunks = this.chunks.map(chunk => {
            let baseScore = chunk.embedding ? this.cosineSimilarity(queryEmbedding, chunk.embedding) : 0;

            // Metadata-based boosting
            if (chunk.metadata?.section === "Work Experience") {
                baseScore *= 1.3; // %30 boost for professional roles
            }

            // Skills soruları için tüm skill chunk'larının gelmesini sağla
            if (chunk.metadata?.section === "Skills" && query.toLowerCase().includes("yetenek")) {
                baseScore *= 1.2; // %20 boost for skills when asking about yetenekler
            }

            // Priority boost: Önemli projeleri ön plana çıkar
            if (chunk.metadata?.priority === "high") {
                baseScore *= 1.4; // %40 boost for high priority items
            }

            // Staj projeleri için düşük öncelik (ana projeler öne çıksın)
            if (chunk.metadata?.context === "internship") {
                baseScore *= 0.8; // %20 reduction for internship projects
            }

            return {
                chunk,
                score: baseScore
            };
        });

        return scoredChunks
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(item => item.chunk);
    }

    private cosineSimilarity(vecA: number[], vecB: number[]): number {
        const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
        const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
        const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
        return dotProduct / (magA * magB);
    }
}
