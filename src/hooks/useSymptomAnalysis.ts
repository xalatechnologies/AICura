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

export interface BodyPart {
  id: string;
  name: string;
  commonSymptoms: string[];
  coordinates?: {
    x: number;
    y: number;
    radius: number;
  };
}

export const BODY_PARTS: BodyPart[] = [
  {
    id: 'head',
    name: 'Head & Face',
    commonSymptoms: ['Headache', 'Migraine', 'Dizziness', 'Vision changes', 'Facial pain'],
    coordinates: { x: 50, y: 20, radius: 12 }
  },
  {
    id: 'chest',
    name: 'Chest & Breathing',
    commonSymptoms: ['Chest pain', 'Shortness of breath', 'Cough', 'Heart palpitations'],
    coordinates: { x: 50, y: 60, radius: 15 }
  },
  {
    id: 'abdomen',
    name: 'Abdomen & Digestive',
    commonSymptoms: ['Abdominal pain', 'Nausea', 'Bloating', 'Diarrhea', 'Loss of appetite'],
    coordinates: { x: 50, y: 85, radius: 15 }
  },
  {
    id: 'arms',
    name: 'Arms & Hands',
    commonSymptoms: ['Joint pain', 'Muscle aches', 'Weakness', 'Numbness', 'Tingling'],
    coordinates: { x: 25, y: 60, radius: 12 }
  },
  {
    id: 'legs',
    name: 'Legs & Feet',
    commonSymptoms: ['Joint pain', 'Muscle aches', 'Swelling', 'Numbness', 'Cramping'],
    coordinates: { x: 50, y: 140, radius: 20 }
  }
];

export interface Symptom {
  id: string;
  name: string;
  severity: number;
  frequency: string;
  bodyPartId?: string;
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
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | null>(null);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentRound, setCurrentRound] = useState<FollowUpRound | null>(null);
  const [currentRoundNumber, setCurrentRoundNumber] = useState(0);
  const [showCTAs, setShowCTAs] = useState(false);
  const abortController = useRef<AbortController | null>(null);

  const selectBodyPart = useCallback((partId: string) => {
    const part = BODY_PARTS.find(p => p.id === partId);
    if (part) {
      setSelectedBodyPart(part);
      setSuggestions(part.commonSymptoms);
    }
  }, []);

  const addSymptom = useCallback((name: string, severity: number = 5, frequency: string = 'Sometimes') => {
    setSymptoms(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name,
        severity,
        frequency,
        bodyPartId: selectedBodyPart?.id
      }
    ]);
  }, [selectedBodyPart]);

  const updateSymptom = useCallback((id: string, updates: Partial<Symptom>) => {
    setSymptoms(prev => prev.map(s => 
      s.id === id ? { ...s, ...updates } : s
    ));
  }, []);

  const removeSymptom = useCallback((id: string) => {
    setSymptoms(prev => prev.filter(s => s.id !== id));
  }, []);

  const submitSymptoms = useCallback(async () => {
    if (symptoms.length === 0) return;

    setIsAnalyzing(true);
    const symptomsDescription = symptoms.map(s => 
      `${s.name} (Severity: ${s.severity}/10, Frequency: ${s.frequency}${s.bodyPartId ? `, Area: ${BODY_PARTS.find(p => p.id === s.bodyPartId)?.name}` : ''})`
    ).join('\n');

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: symptomsDescription,
      timestamp: Date.now(),
      role: 'user'
    };
    setMessages([userMessage]);

    try {
      const analysisContent = await aiAnalyzeSymptoms(symptomsDescription);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: analysisContent,
        timestamp: Date.now(),
        role: 'assistant'
      };
      setMessages(prev => [...prev, aiMessage]);

      setTimeout(() => {
        setCurrentRound(ROUND_QUESTIONS[0]);
        setCurrentRoundNumber(1);
      }, 500);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [symptoms]);

  const resetAnalysis = useCallback(() => {
    setMessages([]);
    setSuggestions([]);
    setCurrentRound(null);
    setCurrentRoundNumber(0);
    setSymptoms([]);
    setSelectedBodyPart(null);
    setShowCTAs(false);
  }, []);

  return {
    bodyParts: BODY_PARTS,
    selectedBodyPart,
    selectBodyPart,
    symptoms,
    addSymptom,
    updateSymptom,
    removeSymptom,
    suggestions,
    messages,
    isAnalyzing,
    currentRound,
    showCTAs,
    submitSymptoms,
    resetAnalysis,
  };
};
