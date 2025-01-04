import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import type { Symptom } from '../types';

interface SymptomInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  suggestions?: string[];
  onAddSymptom?: (symptom: Omit<Symptom, "id">) => void;
}

export const SymptomInput = ({
  value,
  onChangeText,
  placeholder,
  suggestions = [],
  onAddSymptom,
}: SymptomInputProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          multiline
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    padding: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
}); 