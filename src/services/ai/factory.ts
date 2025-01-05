import { AIService, AIServiceConfig } from './types';
import { DeepSeekAIService } from './deepseek.service';

export type AIProvider = 'deepseek' | 'other_provider';

export class AIServiceFactory {
  static create(provider: AIProvider, config?: Partial<AIServiceConfig>): AIService {
    switch (provider) {
      case 'deepseek':
        return new DeepSeekAIService(config);
      default:
        throw new Error(`AI provider ${provider} not supported`);
    }
  }
}
