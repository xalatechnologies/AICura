import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeContext';
import { BodyMap } from '../BodyMap';
import { SymptomInput } from '../SymptomInput';
import { BODY_PARTS } from '../../constants';
import { BodyPart, Symptom } from '../../types';

interface SymptomLocationStepProps {
  onDataChange?: (data: any) => void;
}

export const SymptomLocationStep: React.FC<SymptomLocationStepProps> = ({
  onDataChange,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [selectedBodyPart, setSelectedBodyPart] = useState<BodyPart | null>(null);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [inputText, setInputText] = useState('');

  const handleSelectBodyPart = (partId: string) => {
    const part = BODY_PARTS.find(p => p.id === partId);
    setSelectedBodyPart(part || null);
    onDataChange?.({ selectedBodyPart: part });
  };

  const handleAddSymptom = (symptom: Omit<Symptom, 'id'>) => {
    const newSymptom = {
      id: Date.now().toString(),
      ...symptom,
      bodyPart: selectedBodyPart?.name,
    };
    setSymptoms(prev => [...prev, newSymptom]);
    onDataChange?.({ symptoms: [...symptoms, newSymptom] });
  };

  return (
    <View style={styles.container}>
      <View style={styles.bodyMapContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('symptoms.selectBodyPart')}
        </Text>
        <BodyMap
          bodyParts={BODY_PARTS}
          selectedPart={selectedBodyPart}
          onSelectPart={handleSelectBodyPart}
        />
        {selectedBodyPart && (
          <Text style={[styles.selectedPartText, { color: colors.primary }]}>
            {selectedBodyPart.name}
          </Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('symptoms.describeSymptoms')}
        </Text>
        <SymptomInput
          value={inputText}
          onChangeText={setInputText}
          suggestions={selectedBodyPart?.commonSymptoms || []}
          onAddSymptom={handleAddSymptom}
          placeholder={t('symptoms.analyzer.inputPlaceholder')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  bodyMapContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  selectedPartText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
}); 