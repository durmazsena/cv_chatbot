import { pipeline } from "@xenova/transformers";
import * as fs from "fs";
import * as path from "path";

async function embedCV() {
    const filePath = path.join(process.cwd(), "src/infrastructure/data/cv_data.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    console.log("🚀 Yerel Embedding işlemi başlıyor (Transformers.js)...");

    // Load the pipeline
    const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

    for (const chunk of data) {
        console.log(`- İşleniyor: ${chunk.id}`);
        const output = await embedder(chunk.content, { pooling: 'mean', normalize: true });
        chunk.embedding = Array.from(output.data);
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log("✅ Başarıyla tamamlandı! src/infrastructure/data/cv_data.json güncellendi.");
}

embedCV().catch(err => {
    console.error("❌ Hata oluştu:", err);
    process.exit(1);
});
