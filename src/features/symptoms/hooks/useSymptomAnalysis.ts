import { useState, useCallback } from 'react';
import { Audio } from 'expo-av';
import { analyzeSymptoms, getSuggestions, getFollowUpQuestion } from '@services/ai';
import { Symptom, BodyPart, FollowUpRound } from '../types';
import { BODY_PARTS } from '../constants';

export const useSymptomAnalysis = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [followUpRounds, setFollowUpRounds] = useState<FollowUpRound[]>([]);
  const [currentRound, setCurrentRound] = useState(0);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      // TODO: Send audio file to transcription service
    } catch (err) {
      console.error('Failed to stop recording', err);
    }

    setRecording(null);
  };

  const addSymptom = useCallback((symptom: Omit<Symptom, 'id'>) => {
    setSymptoms(prev => [...prev, { ...symptom, id: Date.now().toString() }]);
  }, []);

  const updateSymptomSeverity = useCallback((id: string, severity: number) => {
    setSymptoms(prev => prev.map(s => 
      s.id === id ? { ...s, severity } : s
    ));
  }, []);

  const updateSymptomFrequency = useCallback((id: string, frequency: Symptom['frequency']) => {
    setSymptoms(prev => prev.map(s => 
      s.id === id ? { ...s, frequency } : s
    ));
  }, []);

  const selectBodyPart = useCallback((partId: string) => {
    const part = BODY_PARTS.find(p => p.id === partId);
    if (part) {
      setSelectedBodyPart(part);
      setSuggestions(part.commonSymptoms);
    }
  }, []);

  const submitSymptoms = useCallback(async () => {
    if (symptoms.length === 0) return;

    try {
      const userMessage = symptoms
        .map(s => `${s.name} (Severity: ${s.severity}/10, Frequency: ${s.frequency}${s.bodyPart ? `, Location: ${s.bodyPart}` : ''})`)
        .join(', ');

      const analysis = await analyzeSymptoms(userMessage);
      setMessages(prev => [...prev, userMessage, analysis]);

      const newSuggestions = await getSuggestions(analysis);
      setSuggestions(newSuggestions);

      const nextQuestion = await getFollowUpQuestion(analysis);
      if (nextQuestion) {
        setFollowUpRounds(prev => [...prev, nextQuestion]);
      }

      setCurrentRound(prev => prev + 1);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
    }
  }, [symptoms]);

  const selectFollowUpOption = useCallback((option: string) => {
    setFollowUpRounds(prev => {
      const updated = [...prev];
      if (updated[currentRound]) {
        updated[currentRound].selectedOption = option;
      }
      return updated;
    });
  }, [currentRound]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    symptoms,
    addSymptom,
    updateSymptomSeverity,
    updateSymptomFrequency,
    selectedBodyPart,
    selectBodyPart,
    messages,
    suggestions,
    followUpRounds,
    currentRound,
    submitSymptoms,
    selectFollowUpOption,
  };
}; 