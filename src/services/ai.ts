import OpenAI from 'openai';
import { OPENAI_API_KEY } from '@env';

const SYSTEM_PROMPT = `You are an AI medical assistant designed to help users analyze their symptoms. Follow these guidelines:

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
- Maintain appropriate medical disclaimers`;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const analyzeSymptoms = async (userMessage: string): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'Unable to analyze symptoms.';
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw error;
  }
};

export const getSuggestions = async (analysis: string): Promise<string[]> => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Based on the symptom analysis, suggest relevant follow-up questions or additional symptoms to consider.' },
        { role: 'user', content: analysis }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const suggestions = completion.choices[0]?.message?.content || '';
    return suggestions.split('\n').filter((s: string) => s.trim().length > 0);
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return [];
  }
};

export const getFollowUpQuestion = async (analysis: string): Promise<{ question: string; options: string[] } | null> => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Generate a follow-up question with multiple choice options based on the symptom analysis.' },
        { role: 'user', content: analysis }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) return null;

    // Parse the response into question and options
    const [question, ...options] = response.split('\n').filter((s: string) => s.trim().length > 0);
    return {
      question,
      options: options.map((opt: string) => opt.replace(/^[•\-*]\s*/, '').trim())
    };
  } catch (error) {
    console.error('Error getting follow-up question:', error);
    return null;
  }
};

