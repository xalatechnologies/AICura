import { useState, useCallback, useRef } from 'react';
import { getSuggestions, analyzeSymptoms, getFollowUpQuestion } from '../services/ai';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  followUpOptions?: string[];
}

export interface FollowUpAnswer {
  question: string;
  answer: string | number | { duration?: string; frequency?: string };
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

export interface FollowUpRound {
  round: number;
  questions: FollowUpQuestion[];
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

export function useSymptomAnalysis() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentRound, setCurrentRound] = useState<FollowUpRound | null>(null);
  const [roundAnswers, setRoundAnswers] = useState<FollowUpAnswer[]>([]);
  const [currentRoundNumber, setCurrentRoundNumber] = useState(0);
  const [allAnswers, setAllAnswers] = useState<FollowUpAnswer[]>([]);
  const abortController = useRef<AbortController | null>(null);

  const getSymptomsInput = useCallback(async (input: string) => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await getSuggestions(input);
      // Process suggestions to include related symptoms
      const simplifiedSuggestions = response
        .filter(Boolean)
        .map(suggestion => {
          // Clean up the suggestion text and extract main symptom
          const cleanSuggestion = suggestion.trim()
            .replace(/^[•\-\*]\s*/, '') // Remove bullet points
            .split(/[:\.\n]/)[0] // Take only the first part before any punctuation
            .trim();
          return cleanSuggestion;
        })
        .filter(suggestion => {
          const suggestionLower = suggestion.toLowerCase();
          const inputLower = input.toLowerCase();
          // Include suggestions that:
          // 1. Start with the input
          // 2. Contain the input
          // 3. Are common related symptoms (based on the AI response)
          return suggestionLower.startsWith(inputLower) || 
                 suggestionLower.includes(inputLower) ||
                 suggestion.length > 0;
        })
        .slice(0, 8); // Show more suggestions (up to 8)

      setSuggestions(simplifiedSuggestions);
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
    // Store answers without displaying them
    setAllAnswers(prev => [...prev, ...answers]);

    // Clear current round answers
    setRoundAnswers([]);

    // If there's another round, process it
    if (currentRoundNumber < 3) {
      processFollowUpRound(currentRoundNumber + 1);
    } else {
      // Final analysis after all rounds
      const initialSymptom = messages[messages.length - 2]?.content || '';
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
      
      // Reset states before final analysis
      setCurrentRound(null);
      setCurrentRoundNumber(0);
      setAllAnswers([]);

      // Clear previous messages except the initial symptom
      const initialMessages = messages.slice(0, 2);
      setMessages(initialMessages);

      // Send final assessment request
      await submitSymptoms(
        `Based on the patient's initial report of: "${initialSymptom}"\n\nDetailed Information from Follow-up Questions:\n${formattedAnswers}\n\nPlease provide a comprehensive assessment and potential diagnoses.`,
        true
      );
    }
  }, [currentRoundNumber, allAnswers, messages]);

  const handleFollowUpResponse = useCallback(async (response: string, context: string) => {
    // Start with round 1 when follow-up begins
    processFollowUpRound(1);
  }, []);

  const submitSymptoms = useCallback(async (symptoms: string, isFinalAssessment = false) => {
    setIsAnalyzing(true);
    setSuggestions([]);

    if (!isFinalAssessment) {
      // For initial symptom submission
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: symptoms,
        timestamp: Date.now(),
      };
      setMessages([userMessage]); // Start fresh conversation

      try {
        if (abortController.current) {
          abortController.current.abort();
        }
        abortController.current = new AbortController();

        const stream = await analyzeSymptoms(symptoms);
        let analysisContent = '';

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          analysisContent += content;
        }

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: analysisContent,
          timestamp: Date.now(),
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
      }
    } else {
      // For final assessment
      try {
        const stream = await analyzeSymptoms(symptoms);
        let analysisContent = '';

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          analysisContent += content;
        }

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: analysisContent,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error in final assessment:', error);
        }
      }
    }

    setIsAnalyzing(false);
    abortController.current = null;
  }, []);

  return {
    suggestions,
    messages,
    isAnalyzing,
    currentRound,
    roundAnswers,
    getSymptomsInput,
    submitSymptoms,
    handleFollowUpResponse,
    submitRoundAnswers,
    setRoundAnswers,
  };
}
