export interface BodyPart {
  id: string;
  name: string;
  commonSymptoms: string[];
  coordinates?: {
    x: number;
    y: number;
    radius: number;
  };
  regions?: string[];
}

export interface Symptom {
  id: string;
  name: string;
  severity: number;
  frequency: 'Never' | 'Rarely' | 'Sometimes' | 'Often' | 'Always';
  bodyPart?: string;
}

export interface SymptomAnalysis {
  symptoms: Symptom[];
  messages: string[];
  suggestions: string[];
  followUpRounds: FollowUpRound[];
  currentRound: number;
}

export interface FollowUpRound {
  question: string;
  options: string[];
  selectedOption?: string;
}

export const FREQUENCIES = [
  'Never',
  'Rarely',
  'Sometimes',
  'Often',
  'Always',
] as const; 