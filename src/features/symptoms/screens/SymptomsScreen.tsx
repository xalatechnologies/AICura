import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { SymptomInput } from '../components/SymptomInput';
import { Symptom } from '../types';
import { useTheme } from '@/theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/shared/Header';
import Voice from '@react-native-voice/voice';

export const SymptomsScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    Voice.onSpeechStart = () => setIsRecording(true);
    Voice.onSpeechEnd = () => setIsRecording(false);
    Voice.onSpeechResults = (e: any) => {
      if (e?.value?.[0]) {
        setInputText(prev => prev + ' ' + e.value[0]);
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const handleAddSymptom = (symptom: Omit<Symptom, 'id'>) => {
    setSymptoms((prevSymptoms) => [
      ...prevSymptoms,
      { id: Date.now().toString(), ...symptom },
    ]);
  };

  const onStartRecording = async () => {
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const onStopRecording = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title={t('symptoms.analyzer.title')} 
        showBack 
      />
      <SymptomInput
        value={inputText}
        onChangeText={setInputText}
        suggestions={[]}
        onAddSymptom={handleAddSymptom}
        isRecording={isRecording}
        onStartRecording={onStartRecording}
        onStopRecording={onStopRecording}
        placeholder={t('symptoms.analyzer.inputPlaceholder')}
      />
      <FlatList
        data={symptoms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.symptomItem, { borderColor: colors.border }]}>
            <Text style={[styles.symptomName, { color: colors.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.symptomDetail, { color: colors.text }]}>
              {t('symptoms.frequency')}: {t(`symptoms.frequencies.${item.frequency}`)}
            </Text>
            <Text style={[styles.symptomDetail, { color: colors.text }]}>
              {t('symptoms.severity')}: {item.severity}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  symptomItem: {
    padding: 12,
    borderBottomWidth: 1,
  },
  symptomName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  symptomDetail: {
    fontSize: 14,
    marginTop: 2,
  },
  listContent: {
    padding: 16,
  },
}); 