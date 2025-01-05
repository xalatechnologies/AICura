import OpenAI from 'openai';
import { AIServiceConfig, AIResponse, OpenAIModel, MODEL_CONFIGS } from './types';
import { BaseAIService } from './base';

const SYSTEM_PROMPTS = {
  symptomSuggestions: 'You are a medical AI assistant. When given a partial symptom description, suggest relevant medical symptoms that could complete or relate to what the user is describing. Return exactly 5 suggestions in a JSON array format.',
  symptomAnalysis: `You are an AI medical assistant designed to help users analyze their symptoms. Follow these guidelines:

1. Initial Symptom Assessment:
   - Ask about primary symptoms, duration, and severity
   - Explore associated symptoms
   - Note symptom patterns and triggers

2. Medical Context:
   - Consider patient history and risk factors
   - Ask about previous treatments and their effectiveness
   - Note any allergies or medications

3. Risk Assessment:
   - Identify red flags or emergency symptoms
   - Assess severity and urgency
   - Consider potential complications

4. Diagnostic Approach:
   - Follow systematic diagnostic reasoning
   - Consider common and serious causes
   - Note key diagnostic features

5. Management Recommendations:
   - Suggest appropriate next steps
   - Provide self-care advice when appropriate
   - Indicate when to seek medical attention

Remember to:
- Be clear and professional
- Avoid definitive diagnoses
- Emphasize when emergency care is needed
- Maintain appropriate medical disclaimers`,
  followUpQuestions: 'Based on the symptom analysis, suggest relevant follow-up questions or additional symptoms to consider.',
};

interface OpenAIServiceConfig extends AIServiceConfig {
  model?: OpenAIModel;
}

export class OpenAIService extends BaseAIService {
  private client: OpenAI;
  protected config: OpenAIServiceConfig;

  constructor(config: { apiKey: string } & Partial<Omit<OpenAIServiceConfig, 'apiKey'>>) {
    super(config);
    this.config = {
      ...config,
      model: (config.model || 'gpt-4') as OpenAIModel,
    };
    this.client = new OpenAI({
      apiKey: this.config.apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  private calculateCost(usage: { prompt_tokens: number; completion_tokens: number }): number {
    const modelConfig = MODEL_CONFIGS[this.config.model as OpenAIModel];
    const totalTokens = usage.prompt_tokens + usage.completion_tokens;
    return (totalTokens / 1000) * modelConfig.costPer1kTokens;
  }

  private async createCompletion<T extends string | string[]>(
    messages: Array<OpenAI.ChatCompletionMessageParam>,
    options?: Partial<OpenAIServiceConfig>
  ) {
    const config = this.getMergedConfig(options) as OpenAIServiceConfig;
    const modelConfig = MODEL_CONFIGS[config.model as OpenAIModel];

    const completion = await this.client.chat.completions.create({
      model: config.model || 'gpt-4',
      messages,
      max_tokens: config.maxTokens || modelConfig.maxTokens,
      temperature: config.temperature || modelConfig.temperature,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return {
        content: ([] as unknown as T),
        usage: completion.usage ? {
          promptTokens: completion.usage.prompt_tokens,
          completionTokens: completion.usage.completion_tokens,
          totalTokens: completion.usage.total_tokens,
          estimatedCost: this.calculateCost(completion.usage),
        } : undefined,
      };
    }

    return {
      content: (content as unknown) as T,
      usage: completion.usage ? {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens,
        estimatedCost: this.calculateCost(completion.usage),
      } : undefined,
    };
  }

  async generateSuggestions(
    input: string,
    options?: Partial<OpenAIServiceConfig>
  ): Promise<AIResponse<string[]>> {
    try {
      const { content, usage } = await this.createCompletion<string>([
        {
          role: 'system',
          content: SYSTEM_PROMPTS.symptomSuggestions + ' Format the response as a JSON array of strings.'
        },
        {
          role: 'user',
          content: `Based on this partial symptom description: "${input}", suggest relevant medical symptoms.`
        }
      ], { ...options, temperature: 0.7 });

      let suggestions: string[];
      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.every((item: unknown) => typeof item === 'string')) {
          suggestions = parsed;
        } else if (typeof parsed === 'object' && Array.isArray(parsed.suggestions)) {
          suggestions = parsed.suggestions.filter((item: unknown) => typeof item === 'string');
        } else {
          suggestions = [];
        }
      } catch {
        // Fallback to line-by-line parsing if JSON parsing fails
        suggestions = content
          .split(/[\n,]/) // Split by newlines or commas
          .map(s => s.trim())
          .map(s => s.replace(/^[-*•]\s*/, '')) // Remove list markers
          .filter(s => s.length > 0 && !s.match(/^\d+\./)); // Remove numbered lists and empty lines
      }

      // Ensure we have exactly 5 suggestions
      suggestions = suggestions
        .filter(s => s.length >= 3) // Remove very short strings
        .slice(0, 5);

      // If we have fewer than 5 suggestions, pad with empty strings
      while (suggestions.length < 5) {
        suggestions.push('');
      }

      return {
        data: suggestions,
        usage,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async analyzeSymptoms(userMessage: string): Promise<AIResponse<string[]>> {
    try {
      const { content, usage } = await this.createCompletion<string>([
        { role: 'system', content: SYSTEM_PROMPTS.symptomAnalysis },
        { role: 'user', content: userMessage }
      ], { maxTokens: 1000 });

      if (Array.isArray(content)) {
        return {
          data: content,
          usage,
        };
      }

      return {
        data: [content],
        usage,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getFollowUpQuestions(analysis: string): Promise<AIResponse<string[]>> {
    try {
      const { content, usage } = await this.createCompletion<string>([
        { role: 'system', content: SYSTEM_PROMPTS.followUpQuestions },
        { role: 'user', content: analysis }
      ]);

      let questions: string[];
      try {
        questions = JSON.parse(content);
        if (!Array.isArray(questions)) {
          questions = [];
        }
      } catch {
        questions = content.split('\n')
          .map(s => s.trim())
          .filter(s => s.length > 0);
      }

      return {
        data: questions,
        usage,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Helper method to get available models
  getAvailableModels(): OpenAIModel[] {
    return Object.keys(MODEL_CONFIGS) as OpenAIModel[];
  }

  // Helper method to get model config
  getModelConfig(model: OpenAIModel): typeof MODEL_CONFIGS[OpenAIModel] {
    return MODEL_CONFIGS[model];
  }
}
