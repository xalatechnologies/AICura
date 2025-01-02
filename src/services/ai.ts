import OpenAI from 'openai';
import { DEEPSEEK_API_KEY, DEEPSEEK_BASE_URL, OPENAI_API_KEY } from './ai-config';

const SYSTEM_PROMPT = `You are an advanced AI medical assistant. Follow this response format:
const SYSTEM_PROMPT = `You are an advanced AI medical assistant. Follow this response format:

First, provide a brief 2-3 sentence summary of the user's symptoms and express empathy about their impact. Do not include any diagnosis yet.
First, provide a brief 2-3 sentence summary of the user's symptoms and express empathy about their impact. Do not include any diagnosis yet.

Then, gather information through three rounds of follow-up questions. Only show the current round's questions, and do not include any analysis until all rounds are complete.
Then, gather information through three rounds of follow-up questions. Only show the current round's questions, and do not include any analysis until all rounds are complete.

For the final analysis (only after all rounds), provide:
For the final analysis (only after all rounds), provide:
- Comprehensive symptom analysis
- Potential causes and conditions
- Clear recommendations
- Relevant disclaimers

Keep responses conversational and focused. Do not mention "rounds" or "phases" to the user.
Always maintain a supportive and professional tone.`;

const FOLLOW_UP_PROMPT = `Generate the next appropriate follow-up questions based on the conversation context. 

Format each question conversationally, as if you're having a natural dialogue. Include options in parentheses where relevant.

Current Round Context:
Round 1 - Basic Assessment:
• Duration and pattern questions
• Severity rating
• Location and characteristics

Round 2 - Impact & Triggers:
• Aggravating factors
• Relieving factors
• Associated symptoms

Round 3 - History & Risk:
• Previous experiences
• Treatment history
• Warning signs

Only show questions for the current round. Keep the tone empathetic and supportive.`;

// Initialize OpenAI client for both services
const deepseekClient = new OpenAI({
  apiKey: DEEPSEEK_API_KEY,
  baseURL: DEEPSEEK_BASE_URL,
  dangerouslyAllowBrowser: true
});

const openaiClient = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const commonSymptomGroups: { [key: string]: string[] } = {
  head: [
    'Headache',
    'Migraine',
    'Tension headache',
    'Cluster headache',
    'Sinus headache',
    'Dizziness',
    'Vertigo',
    'Blurred vision',
  ],
  chest: [
    'Chest pain',
    'Shortness of breath',
    'Heart palpitations',
    'Rapid heartbeat',
    'Chest tightness',
    'Difficulty breathing',
  ],
  stomach: [
    'Abdominal pain',
    'Nausea',
    'Vomiting',
    'Diarrhea',
    'Constipation',
    'Bloating',
    'Indigestion',
  ],
  general: [
    'Fever',
    'Fatigue',
    'Weakness',
    'Body aches',
    'Chills',
    'Night sweats',
    'Loss of appetite',
  ],
  mental: [
    'Anxiety',
    'Depression',
    'Insomnia',
    'Stress',
    'Mood swings',
    'Difficulty concentrating',
  ],
};

export const getSuggestions = async (input: string): Promise<string[]> => {
  const inputLower = input.toLowerCase();
  let suggestions: string[] = [];

  // Find direct matches and related symptoms
  for (const [category, symptoms] of Object.entries(commonSymptomGroups)) {
    const matchingSymptoms = symptoms.filter(symptom => {
      const symptomLower = symptom.toLowerCase();
      // Check for various matching conditions
      return (
        symptomLower.includes(inputLower) || // Direct match
        inputLower.includes(symptomLower) || // Reverse match
        // Check for common medical terms and their variations
        (inputLower.includes('head') && category === 'head') ||
        (inputLower.includes('chest') && category === 'chest') ||
        (inputLower.includes('stomach') && category === 'stomach') ||
        (inputLower.includes('pain') && symptomLower.includes('pain')) ||
        // Add common related symptoms based on medical knowledge
        (inputLower.includes('headache') && category === 'head') ||
        (inputLower.includes('breath') && category === 'chest') ||
        (inputLower.includes('heart') && category === 'chest') ||
        (inputLower.includes('nausea') && category === 'stomach')
      );
    });
    suggestions = [...suggestions, ...matchingSymptoms];
  }

  // If no matches found, return symptoms from the most relevant category
  if (suggestions.length === 0) {
    for (const [category, symptoms] of Object.entries(commonSymptomGroups)) {
      if (inputLower.includes(category)) {
        suggestions = symptoms;
        break;
      }
    }
  }

  // Add duration and severity qualifiers if the input is long enough
  if (input.length > 3 && suggestions.length > 0) {
    const qualifiedSuggestions = suggestions
      .slice(0, 5)
      .reduce((acc: string[], symptom: string) => {
        return [
          ...acc,
          symptom,
          `${symptom} (severe)`,
          `${symptom} (mild)`,
          `${symptom} (chronic)`,
        ];
      }, []);
    suggestions = Array.from(new Set(qualifiedSuggestions));
  }

  // Limit and sort suggestions
  return suggestions
    .slice(0, 8)
    .sort((a, b) => {
      // Prioritize exact matches
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      if (aLower.startsWith(inputLower)) return -1;
      if (bLower.startsWith(inputLower)) return 1;
      return a.localeCompare(b);
    });
};

export async function analyzeSymptoms(symptoms: string, useOpenAI = true) {
export async function analyzeSymptoms(symptoms: string, useOpenAI = true) {
  const client = useOpenAI ? openaiClient : deepseekClient;
  const model = useOpenAI ? 'gpt-4-turbo-preview' : 'deepseek-chat';

  try {
    const response = await client.chat.completions.create({
      model,
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
    if (!response) {
      throw new Error('No response from AI service');
    }

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error in analyzeSymptoms:', error);
    throw error;
  }
    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error in analyzeSymptoms:', error);
    throw error;
  }
}

export async function getFollowUpQuestion(context: string, useOpenAI = false) {
  const client = useOpenAI ? openaiClient : deepseekClient;
  const model = useOpenAI ? 'gpt-4-turbo-preview' : 'deepseek-chat';

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: FOLLOW_UP_PROMPT },
      { 
        role: 'user', 
        content: `Previous conversation:\n${context}\n\nBased on this context, generate the most appropriate follow-up questions for the current stage of the conversation. Focus on gathering critical information while maintaining a natural, supportive dialogue.`
      }
    ],
    temperature: 0.7,
    max_tokens: 300,
  });

  return response.choices[0].message.content || '';
}

// Helper function to parse follow-up options from AI response
export function parseFollowUpOptions(response: string): string[] {
  const options = response.split('\n')
    .filter(line => line.startsWith('•') || line.startsWith('-'))
    .map(line => {
      // Clean up the line
      let option = line.replace(/^[•\-]\s*/, '').trim();
      
      // If there are parenthetical options, format them as separate choices
      if (option.includes('(') && option.includes(')')) {
        const [question, choices] = option.split('(');
        const choiceList = choices.replace(')', '').split('/');
        
        // Create an array of formatted options
        return choiceList.map(choice => 
          `${question.trim()} ${choice.trim()}`
        );
      }
      
      return [option];
    })
    .reduce((acc, curr) => [...acc, ...curr], [] as string[]);

  return options;
}

