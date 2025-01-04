import { useState, useCallback, useRef } from 'react';
import { getSuggestions, analyzeSymptoms, getFollowUpQuestion } from '../services/ai';

export interface Message {
  type: 'user' | 'ai';
  content: string;
}

export interface FollowUpRound {
  question: string;
  options: string[];
}

export interface FollowUpAnswer {
  question: string;
  answer: string;
}

export const useSymptomAnalysis = () => {
  // Implementation will be added later
  return {
    analyzeSymptoms: async (symptoms: string) => {
      // Placeholder implementation
      return {
        messages: [],
        followUpRound: null,
      };
    },
  };
};
