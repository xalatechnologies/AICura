import { OPENAI_API_KEY } from '@env';
import { OpenAIService } from './ai/openai.service';
import { AIResponse, OpenAIModel } from './ai/types';

const DEFAULT_MODEL: OpenAIModel = 'gpt-4';

class AIServiceManager {
  private service: OpenAIService;
  private currentModel: OpenAIModel;

  constructor() {
    this.currentModel = DEFAULT_MODEL;
    this.service = new OpenAIService({
      apiKey: OPENAI_API_KEY,
      model: this.currentModel,
      maxTokens: 150,
      temperature: 0.7,
    });
  }

  setModel(model: OpenAIModel) {
    this.currentModel = model;
    this.service = new OpenAIService({
      apiKey: OPENAI_API_KEY,
      model: this.currentModel,
      maxTokens: 150,
      temperature: 0.7,
    });
  }

  getCurrentModel(): OpenAIModel {
    return this.currentModel;
  }

  getAvailableModels(): OpenAIModel[] {
    return this.service.getAvailableModels();
  }

  getModelConfig(model: OpenAIModel) {
    return this.service.getModelConfig(model);
  }

  async analyzeSymptoms(userMessage: string): Promise<AIResponse<string[]>> {
    return this.service.analyzeSymptoms(userMessage);
  }

  async getSymptomSuggestions(partialSymptom: string): Promise<AIResponse<string[]>> {
    return this.service.generateSuggestions(partialSymptom);
  }

  async getFollowUpQuestions(analysis: string): Promise<AIResponse<string[]>> {
    return this.service.getFollowUpQuestions(analysis);
  }
}

const aiManager = new AIServiceManager();

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

// Public API
export const setAIModel = (model: OpenAIModel) => aiManager.setModel(model);
export const getCurrentModel = () => aiManager.getCurrentModel();
export const getAvailableModels = () => aiManager.getAvailableModels();
export const getModelConfig = (model: OpenAIModel) => aiManager.getModelConfig(model);

export const analyzeSymptoms = async (userMessage: string): Promise<string[]> => {
  const response = await aiManager.analyzeSymptoms(userMessage);
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
};

export const getSymptomSuggestions = async (partialSymptom: string): Promise<string[]> => {
  const response = await aiManager.getSymptomSuggestions(partialSymptom);
  return response.data;
};

export const getFollowUpQuestions = async (analysis: string): Promise<string[]> => {
  const response = await aiManager.getFollowUpQuestions(analysis);
  return response.data;
};

export const getAISuggestions = async (
  input: string,
  type: 'conditions' | 'allergies' | 'medications' | 'symptoms'
): Promise<string[]> => {
  // TODO: Replace with actual AI service call
  // For now, return mock suggestions
  const mockSuggestions = {
    conditions: [
      'Hypertension',
      'Diabetes Type 2',
      'Asthma',
      'Arthritis',
      'Migraine',
    ],
    allergies: [
      'Pollen',
      'Dust',
      'Penicillin',
      'Peanuts',
      'Latex',
    ],
    medications: [
      'Metformin',
      'Lisinopril',
      'Omeprazole',
      'Levothyroxine',
      'Amlodipine',
    ],
    symptoms: [
      'Headache',
      'Fever',
      'Cough',
      'Fatigue',
      'Nausea',
      'Dizziness',
      'Shortness of breath',
      'Joint pain',
    ],
  };

  return mockSuggestions[type].filter(item =>
    item.toLowerCase().includes(input.toLowerCase())
  );
};
