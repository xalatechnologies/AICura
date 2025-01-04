import OpenAI from 'openai';
import { OPENAI_API_KEY } from './ai-config';

const SYSTEM_PROMPT = `You are an advanced AI medical assistant. Your role is to analyze symptoms and provide medical insights.`;

const openaiClient = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const analyzeSymptoms = async (symptoms: string): Promise<string> => {
  try {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Analyze the following symptoms and provide insights: ${symptoms}` }
      ],
      temperature: 0.7,
      max_tokens: 500,
      stream: false,
    });

    if (!response) {
      throw new Error('No response from AI service');
    }

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error in analyzeSymptoms:', error);
    throw error;
  }
};

