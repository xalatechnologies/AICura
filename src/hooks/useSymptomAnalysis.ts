import { useState, useCallback, useRef } from 'react';
import { analyzeSymptoms as aiAnalyzeSymptoms } from '@services/ai';

export interface Message {
  type: 'user' | 'ai';
  content: string;
  id?: string;
  timestamp?: number;
  role?: 'user' | 'assistant';
}

export interface FollowUpRound {
  round: number;
  questions: FollowUpQuestion[];
}

export interface FollowUpAnswer {
  question: string;
  answer: string;
}

export interface FollowUpQuestion {
  type: 'toggle' | 'slider' | 'multi-toggle' | 'frequency';
  question: string;
  options?: string[];
  min?: number;
  max?: number;
  frequency?: {
    duration: string[];
    frequency: string[];
  };
}

export interface CTAOption {
  id: string;
  label: string;
  action: 'new_check' | 'appointment' | 'contact_doctor';
  icon: string;
}

const ROUND_QUESTIONS: FollowUpRound[] = [
  {
    round: 1,
    questions: [
      {
        type: 'frequency',
        question: 'How long and how often have you been experiencing these symptoms?',
        frequency: {
          duration: ['Less than a week', '1-4 weeks', '1-3 months', 'More than 3 months'],
          frequency: ['Daily', '2-3 times a week', 'Weekly', 'Monthly']
        }
      },
      {
        type: 'slider',
        question: 'How would you rate the pain intensity?',
        min: 1,
        max: 10
      },
      {
        type: 'multi-toggle',
        question: 'What type of pain are you experiencing?',
        options: ['Throbbing', 'Sharp', 'Dull', 'Pressure', 'Burning']
      }
    ]
  },
  {
    round: 2,
    questions: [
      {
        type: 'multi-toggle',
        question: 'What triggers make your symptoms worse?',
        options: ['Stress', 'Physical Activity', 'Certain Foods', 'Weather Changes', 'Bright Lights', 'Loud Sounds', 'Sleep Changes']
      },
      {
        type: 'multi-toggle',
        question: 'What helps relieve your symptoms?',
        options: ['Rest', 'Medication', 'Dark Room', 'Cold/Hot Compress', 'Position Change', 'Nothing Helps']
      },
      {
        type: 'multi-toggle',
        question: 'Do you experience any of these associated symptoms?',
        options: ['Nausea', 'Vomiting', 'Light Sensitivity', 'Sound Sensitivity', 'Vision Changes', 'Dizziness', 'None']
      }
    ]
  },
  {
    round: 3,
    questions: [
      {
        type: 'toggle',
        question: 'Have you experienced these symptoms before?',
        options: ['First Time', 'Recurring Issue', 'Chronic Condition']
      },
      {
        type: 'multi-toggle',
        question: 'What treatments have you tried?',
        options: ['Over-the-counter Pain Relievers', 'Prescription Medications', 'Lifestyle Changes', 'Alternative Therapies', 'None']
      },
      {
        type: 'multi-toggle',
        question: 'Are you experiencing any concerning symptoms?',
        options: ['Sudden Severe Pain', 'Loss of Consciousness', 'Weakness/Numbness', 'Speech Problems', 'Vision Loss', 'None']
      }
    ]
  }
];

export const useSymptomAnalysis = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentRound, setCurrentRound] = useState<FollowUpRound | null>(null);
  const [roundAnswers, setRoundAnswers] = useState<FollowUpAnswer[]>([]);
  const [currentRoundNumber, setCurrentRoundNumber] = useState(0);
  const [allAnswers, setAllAnswers] = useState<FollowUpAnswer[]>([]);
  const [showCTAs, setShowCTAs] = useState(false);
  const abortController = useRef<AbortController | null>(null);

  const resetAnalysis = useCallback(() => {
    setMessages([]);
    setSuggestions([]);
    setCurrentRound(null);
    setCurrentRoundNumber(0);
    setAllAnswers([]);
    setShowCTAs(false);
  }, []);

  const getSymptomsInput = useCallback(async (input: string) => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      setSuggestions([]); // Remove suggestions functionality for now
    } catch (error) {
      console.error('Error getting suggestions:', error);
      setSuggestions([]);
    }
  }, []);

  const processFollowUpRound = useCallback((roundNumber: number) => {
    const rounds: FollowUpRound[] = [
      {
        round: 1,
        questions: [
          {
            type: 'toggle',
            question: 'How long have you been experiencing these symptoms?',
            options: ['Today', 'Few days', 'Week or more', 'Month+']
          },
          {
            type: 'slider',
            question: 'On a scale of 1-10, how would you rate the intensity?',
            min: 1,
            max: 10
          },
          {
            type: 'toggle',
            question: 'Is it constant or does it come and go?',
            options: ['Constant', 'Intermittent', 'Varies']
          }
        ]
      },
      {
        round: 2,
        questions: [
          {
            type: 'multi-toggle',
            question: 'Have you noticed anything that makes it worse?',
            options: ['Activity', 'Food', 'Stress', 'Weather', 'Other']
          },
          {
            type: 'multi-toggle',
            question: 'What helps improve the symptoms?',
            options: ['Rest', 'Medication', 'Position change', 'Nothing']
          },
          {
            type: 'toggle',
            question: 'Are you experiencing any other symptoms alongside?',
            options: ['Yes', 'No']
          }
        ]
      },
      {
        round: 3,
        questions: [
          {
            type: 'toggle',
            question: 'How is this affecting your daily activities?',
            options: ['Minimal', 'Moderate', 'Severe']
          },
          {
            type: 'toggle',
            question: 'Have you experienced this before?',
            options: ['First time', 'Recurring', 'Chronic']
          },
          {
            type: 'multi-toggle',
            question: 'Any concerning changes or symptoms?',
            options: ['Worsening', 'New symptoms', 'Emergency signs', 'None']
          }
        ]
      }
    ];

    setCurrentRound(rounds[roundNumber - 1] || null);
    setCurrentRoundNumber(roundNumber);
  }, []);

  const submitRoundAnswers = useCallback(async (answers: FollowUpAnswer[]) => {
    setAllAnswers(prev => [...prev, ...answers]);
    setRoundAnswers([]);

    if (currentRoundNumber < 3) {
      processFollowUpRound(currentRoundNumber + 1);
    } else {
      const initialSymptom = messages[0]?.content || '';
      const formattedAnswers = allAnswers
        .concat(answers)
        .map(a => {
          if (typeof a.answer === 'object') {
            const freq = a.answer as { duration?: string; frequency?: string };
            return `${a.question}: Duration - ${freq.duration}, Frequency - ${freq.frequency}`;
          }
          return `${a.question}: ${a.answer}`;
        })
        .join('\n');
      
      setCurrentRound(null);
      setCurrentRoundNumber(0);
      setAllAnswers([]);

      try {
        const finalAnalysis = await analyzeSymptoms(
          `Based on the patient's initial report of: "${initialSymptom}"\n\nDetailed Information from Follow-up Questions:\n${formattedAnswers}\n\nPlease provide a comprehensive assessment and potential diagnoses.`
        );

        const aiMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: finalAnalysis,
          timestamp: Date.now(),
          role: 'assistant'
        };

        setMessages(prev => [prev[0], aiMessage]);
        setShowCTAs(true); // Show CTA buttons after final assessment
      } catch (error) {
        console.error('Error in final assessment:', error);
      }
    }
  }, [currentRoundNumber, allAnswers, messages]);

  const handleFollowUpResponse = useCallback(async (response: string, context: string) => {
    // Start with round 1 when follow-up begins
    processFollowUpRound(1);
  }, []);

  const submitSymptoms = useCallback(async (symptoms: string) => {
    setIsAnalyzing(true);
    setSuggestions([]);

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: symptoms,
      timestamp: Date.now(),
      role: 'user'
    };
    setMessages([userMessage]); // Start fresh conversation

    try {
      if (abortController.current) {
        abortController.current.abort();
      }
      abortController.current = new AbortController();

      const analysisContent = await analyzeSymptoms(symptoms);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: analysisContent,
        timestamp: Date.now(),
        role: 'assistant'
      };
      setMessages(prev => [...prev, aiMessage]);

      // Start follow-up questions
      setTimeout(() => {
        setCurrentRound(ROUND_QUESTIONS[0]);
        setCurrentRoundNumber(1);
      }, 500);

    } catch (error: unknown) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error analyzing symptoms:', error);
      }
    } finally {
      setIsAnalyzing(false);
      abortController.current = null;
    }
  }, []);

  const analyzeSymptoms = async (input: string): Promise<string> => {
    try {
      return await aiAnalyzeSymptoms(input);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      throw error;
    }
  };

  return {
    suggestions,
    messages,
    isAnalyzing,
    currentRound,
    showCTAs,
    getSymptomsInput,
    submitSymptoms,
    analyzeSymptoms,
    resetAnalysis,
    setMessages,
  };
};
