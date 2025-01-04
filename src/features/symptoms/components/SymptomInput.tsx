import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { VoiceRecorder } from './VoiceRecorder';
import { SeveritySlider } from './SeveritySlider';
import { Symptom, FREQUENCIES } from '../types';

interface SymptomInputProps {
  suggestions: string[];
  onAddSymptom: (symptom: Omit<Symptom, 'id'>) => void;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export const SymptomInput: React.FC<SymptomInputProps> = ({
  suggestions,
  onAddSymptom,
  isRecording,
  onStartRecording,
  onStopRecording,
}) => {
  const { colors } = useTheme();
  const [text, setText] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState<Symptom['frequency']>('Never');
  const [severity, setSeverity] = useState(0);

  const handleAddSymptom = useCallback(() => {
    if (text.trim()) {
      onAddSymptom({
        name: text.trim(),
        frequency: selectedFrequency,
        severity,
      });
      setText('');
      setSeverity(0);
      setSelectedFrequency(FREQUENCIES[0]);
    }
  }, [text, selectedFrequency, severity, onAddSymptom]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.textInput, { borderColor: colors.border }]}
            placeholder="Enter symptom"
            value={text}
            onChangeText={setText}
          />
          {/* Suggestion List */}
          {suggestions.length > 0 && (
            <ScrollView style={styles.suggestionsContainer}>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setText(suggestion)}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          {/* Frequency Selector */}
          <View style={styles.frequencyContainer}>
            {FREQUENCIES.map((frequency) => (
              <TouchableOpacity
                key={frequency}
                style={[
                  styles.frequencyButton,
                  selectedFrequency === frequency && {
                    backgroundColor: colors.primary,
                  },
                ]}
                onPress={() => setSelectedFrequency(frequency)}
              >
                <Text style={styles.frequencyButtonText}>{frequency}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Severity Slider */}
          <SeveritySlider severity={severity} onValueChange={setSeverity} />
          {/* Voice Recorder */}
          <VoiceRecorder
            isRecording={isRecording}
            onStartRecording={onStartRecording}
            onStopRecording={onStopRecording}
          />
          {/* Add Symptom Button */}
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={handleAddSymptom}
          >
            <Text style={styles.addButtonText}>Add Symptom</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 16,
  },
  inputContainer: {
    padding: 16,
  },
  textInput: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  suggestionsContainer: {
    maxHeight: 100,
    marginBottom: 8,
  },
  suggestionText: {
    padding: 8,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  frequencyButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  frequencyButtonText: {
    color: '#000',
  },
  addButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 