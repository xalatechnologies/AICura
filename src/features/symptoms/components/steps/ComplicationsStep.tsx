import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

interface ComplicationsStepProps {
  onDataChange?: (data: any) => void;
}

type Complication = {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
};

type AdditionalSymptom = {
  id: string;
  name: string;
  description?: string;
};

export const ComplicationsStep: React.FC<ComplicationsStepProps> = ({
  onDataChange,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [complications, setComplications] = useState<Complication[]>([]);
  const [additionalSymptoms, setAdditionalSymptoms] = useState<AdditionalSymptom[]>([]);
  const [newComplication, setNewComplication] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');
  const [newSymptom, setNewSymptom] = useState('');
  const [newSymptomDescription, setNewSymptomDescription] = useState('');

  const handleAddComplication = () => {
    if (newComplication.trim()) {
      const complication = {
        id: Date.now().toString(),
        name: newComplication.trim(),
        severity: selectedSeverity,
      };
      const updated = [...complications, complication];
      setComplications(updated);
      setNewComplication('');
      updateData(updated, additionalSymptoms);
    }
  };

  const handleAddSymptom = () => {
    if (newSymptom.trim()) {
      const symptom = {
        id: Date.now().toString(),
        name: newSymptom.trim(),
        description: newSymptomDescription.trim() || undefined,
      };
      const updated = [...additionalSymptoms, symptom];
      setAdditionalSymptoms(updated);
      setNewSymptom('');
      setNewSymptomDescription('');
      updateData(complications, updated);
    }
  };

  const handleRemoveComplication = (id: string) => {
    const updated = complications.filter(c => c.id !== id);
    setComplications(updated);
    updateData(updated, additionalSymptoms);
  };

  const handleRemoveSymptom = (id: string) => {
    const updated = additionalSymptoms.filter(s => s.id !== id);
    setAdditionalSymptoms(updated);
    updateData(complications, updated);
  };

  const updateData = (
    complicationsData: Complication[],
    symptomsData: AdditionalSymptom[]
  ) => {
    onDataChange?.({
      complications: complicationsData,
      additionalSymptoms: symptomsData,
    });
  };

  const severityOptions: Array<'mild' | 'moderate' | 'severe'> = ['mild', 'moderate', 'severe'];

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('symptoms.complications.title')}
        </Text>
        
        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            value={newComplication}
            onChangeText={setNewComplication}
            placeholder={t('symptoms.complications.placeholder')}
            placeholderTextColor={colors.textSecondary}
          />
          
          <View style={styles.severityContainer}>
            {severityOptions.map(severity => (
              <TouchableOpacity
                key={severity}
                style={[
                  styles.severityButton,
                  {
                    backgroundColor:
                      selectedSeverity === severity ? colors.primary : colors.card,
                  },
                ]}
                onPress={() => setSelectedSeverity(severity)}
              >
                <Text
                  style={[
                    styles.severityText,
                    {
                      color:
                        selectedSeverity === severity ? colors.textInverted : colors.text,
                    },
                  ]}
                >
                  {t(`symptoms.severity.${severity}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={handleAddComplication}
          >
            <Icon name="add" size={24} color={colors.textInverted} />
          </TouchableOpacity>
        </View>

        <View style={styles.chipContainer}>
          {complications.map(complication => (
            <View
              key={complication.id}
              style={[styles.chip, { backgroundColor: colors.card }]}
            >
              <Text style={[styles.chipText, { color: colors.text }]}>
                {complication.name}
              </Text>
              <Text
                style={[
                  styles.severityIndicator,
                  { color: colors.textSecondary },
                ]}
              >
                {t(`symptoms.severity.${complication.severity}`)}
              </Text>
              <TouchableOpacity
                onPress={() => handleRemoveComplication(complication.id)}
                style={styles.removeButton}
              >
                <Icon name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('symptoms.additionalSymptoms.title')}
        </Text>
        
        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            value={newSymptom}
            onChangeText={setNewSymptom}
            placeholder={t('symptoms.additionalSymptoms.namePlaceholder')}
            placeholderTextColor={colors.textSecondary}
          />
          <TextInput
            style={[
              styles.descriptionInput,
              { backgroundColor: colors.card, color: colors.text },
            ]}
            value={newSymptomDescription}
            onChangeText={setNewSymptomDescription}
            placeholder={t('symptoms.additionalSymptoms.descriptionPlaceholder')}
            placeholderTextColor={colors.textSecondary}
            multiline
          />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={handleAddSymptom}
          >
            <Icon name="add" size={24} color={colors.textInverted} />
          </TouchableOpacity>
        </View>

        <View style={styles.chipContainer}>
          {additionalSymptoms.map(symptom => (
            <View
              key={symptom.id}
              style={[styles.chip, { backgroundColor: colors.card }]}
            >
              <Text style={[styles.chipText, { color: colors.text }]}>
                {symptom.name}
              </Text>
              {symptom.description && (
                <Text
                  style={[styles.description, { color: colors.textSecondary }]}
                  numberOfLines={2}
                >
                  {symptom.description}
                </Text>
              )}
              <TouchableOpacity
                onPress={() => handleRemoveSymptom(symptom.id)}
                style={styles.removeButton}
              >
                <Icon name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 8,
  },
  descriptionInput: {
    height: 80,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 16,
    marginBottom: 8,
    textAlignVertical: 'top',
  },
  severityContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  severityButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  severityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  chipText: {
    fontSize: 14,
    marginRight: 4,
  },
  severityIndicator: {
    fontSize: 12,
    marginRight: 4,
  },
  description: {
    fontSize: 12,
    marginTop: 2,
    flex: 1,
  },
  removeButton: {
    padding: 2,
  },
}); 