import { AIService, AIServiceConfig, AIResponse } from './types';

export const DEFAULT_CONFIG: AIServiceConfig = {
  apiKey: '',
  maxTokens: 150,
  temperature: 0.7,
};

export abstract class BaseAIService implements AIService {
  protected config: AIServiceConfig;

  constructor(config: Partial<AIServiceConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  abstract generateSuggestions(
    input: string,
    options?: Partial<AIServiceConfig>
  ): Promise<AIResponse<string[]>>;

  protected getMergedConfig(options?: Partial<AIServiceConfig>): AIServiceConfig {
    return { ...this.config, ...options };
  }

  protected handleError(error: unknown): AIResponse<string[]> {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('AI Service Error:', errorMessage);
    return { data: [], error: errorMessage };
  }
}
