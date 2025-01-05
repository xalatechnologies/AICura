export type OpenAIModel = 'gpt-4' | 'gpt-4-0613' | 'gpt-3.5-turbo' | 'gpt-3.5-turbo-0613';

export interface ModelConfig {
  maxTokens: number;
  temperature: number;
  costPer1kTokens: number; // Cost in USD
  contextWindow: number;   // Maximum context length
}

export interface AIServiceConfig {
  apiKey: string;
  endpoint?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIResponse<T> {
  data: T;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCost?: number;
  };
}

export interface AIService {
  generateSuggestions(input: string, options?: Partial<AIServiceConfig>): Promise<AIResponse<string[]>>;
}

export const MODEL_CONFIGS: Record<OpenAIModel, ModelConfig> = {
  'gpt-4': {
    maxTokens: 8192,
    temperature: 0.7,
    costPer1kTokens: 0.03,
    contextWindow: 8192,
  },
  'gpt-4-0613': {
    maxTokens: 8192,
    temperature: 0.7,
    costPer1kTokens: 0.03,
    contextWindow: 8192,
  },
  'gpt-3.5-turbo': {
    maxTokens: 4096,
    temperature: 0.7,
    costPer1kTokens: 0.002,
    contextWindow: 4096,
  },
  'gpt-3.5-turbo-0613': {
    maxTokens: 4096,
    temperature: 0.7,
    costPer1kTokens: 0.002,
    contextWindow: 4096,
  },
};
