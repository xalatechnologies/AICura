import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { SymptomInput } from '../components/SymptomInput';
import { Symptom } from '../types';
import { useTheme } from '@theme/ThemeContext';

const SymptomsScreen: React.FC = () => {
  const { colors } = useTheme();
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const handleAddSymptom = (symptom: Omit<Symptom, 'id'>) => {
    setSymptoms((prevSymptoms) => [
      ...prevSymptoms,
      { id: Date.now().toString(), ...symptom },
    ]);
  };

  const onStartRecording = () => {
    setIsRecording(true);
    // Start recording logic
  };

  const onStopRecording = () => {
    setIsRecording(false);
    // Stop recording and process audio
  };

  return (
    <View style={styles.container}>
      <SymptomInput
        suggestions={[]}
        onAddSymptom={handleAddSymptom}
        isRecording={isRecording}
        onStartRecording={onStartRecording}
        onStopRecording={onStopRecording}
      />
      <FlatList
        data={symptoms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.symptomItem, { borderColor: colors.border }]}>
            <Text style={{ color: colors.text, fontWeight: 'bold' }}>
              {item.name}
            </Text>
            <Text style={{ color: colors.text }}>
              Frequency: {item.frequency}
            </Text>
            <Text style={{ color: colors.text }}>
              Severity: {item.severity}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default SymptomsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  symptomItem: {
    padding: 12,
    borderBottomWidth: 1,
  },
  listContent: {
    padding: 16,
  },
}); 