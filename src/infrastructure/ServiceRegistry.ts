import { OpenAIChatService } from "./services/OpenAIChatService";
import { LocalVectorStorage } from "./repositories/LocalVectorStorage";
import { GetChatResponseUseCase } from "@/application/use-cases/GetChatResponse";
import cvData from "./data/cv_data.json";
import { CVChunk } from "@/domain/entities/chat";

export class ServiceRegistry {
    private static _chatService = new OpenAIChatService();
    private static _vectorStorage = new LocalVectorStorage();
    private static _initialized = false;

    static getChatService() {
        return this._chatService;
    }

    static async getVectorRepository() {
        if (!this._initialized) {
            await this._vectorStorage.saveChunks(cvData as CVChunk[]);
            this._initialized = true;
        }
        return this._vectorStorage;
    }

    static async getGetChatResponseUseCase() {
        await this.getVectorRepository();
        return new GetChatResponseUseCase(this._chatService, this._vectorStorage);
    }
}
