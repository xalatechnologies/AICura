import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Symptom } from '@symptoms/types';

interface SymptomInputProps {
  value: string;
  onChangeText: (text: string) => void;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  placeholder?: string;
  suggestions?: string[];
  onAddSymptom?: (symptom: Omit<Symptom, "id">) => void;
}

export const SymptomInput: React.FC<SymptomInputProps> = ({
  value,
  onChangeText,
  isRecording,
  onStartRecording,
  onStopRecording,
  placeholder,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <TextInput
        style={[
          styles.input,
          { color: colors.text, backgroundColor: colors.background },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
      <TouchableOpacity
        style={[styles.micButton, { backgroundColor: colors.primary }]}
        onPress={isRecording ? onStopRecording : onStartRecording}
      >
        <MaterialCommunityIcons
          name={isRecording ? 'microphone-off' : 'microphone'}
          size={24}
          color="#FFFFFF"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  input: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
}); 