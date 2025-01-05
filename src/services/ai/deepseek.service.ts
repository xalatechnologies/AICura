import { AIService, AIServiceConfig, AIResponse } from './types';

const DEFAULT_CONFIG: AIServiceConfig = {
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  endpoint: 'https://api.deepseek.com/v1/chat/completions',
  model: 'deepseek-chat',
  maxTokens: 150,
  temperature: 0.7,
};

export class DeepSeekAIService implements AIService {
  private config: AIServiceConfig;

  constructor(config: Partial<AIServiceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async generateSuggestions(
    input: string,
    options?: Partial<AIServiceConfig>
  ): Promise<AIResponse<string[]>> {
    try {
      const config = { ...this.config, ...options };
      
      const response = await fetch(config.endpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            {
              role: 'system',
              content: 'You are a medical AI assistant. When given a partial symptom description, suggest relevant medical symptoms that could complete or relate to what the user is describing. Return exactly 5 suggestions in a JSON array format.',
            },
            {
              role: 'user',
              content: `Based on this partial symptom description: "${input}", suggest relevant medical symptoms. Return only a JSON array of 5 strings.`,
            },
          ],
          temperature: config.temperature,
          max_tokens: config.maxTokens,
          response_format: { type: 'json_object' },
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to get suggestions');
      }

      const suggestions = JSON.parse(data.choices[0].message.content);
      return { data: suggestions.suggestions };
    } catch (error) {
      console.error('DeepSeek AI Service Error:', error);
      return { data: [], error: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
  }
}
