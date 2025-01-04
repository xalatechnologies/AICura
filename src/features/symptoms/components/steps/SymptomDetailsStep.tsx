import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeContext';
import Slider from '@react-native-community/slider';
import { Symptom } from '../../types';

interface SymptomDetailsStepProps {
  onDataChange?: (data: any) => void;
  symptoms?: Symptom[];
}

type Onset = 'hours' | 'days' | 'weeks' | 'months';
type Duration = 'constant' | 'intermittent';
type Trigger = 'movement' | 'rest' | 'food' | 'stress' | 'weather' | 'other';

export const SymptomDetailsStep: React.FC<SymptomDetailsStepProps> = ({
  onDataChange,
  symptoms = [],
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);
  const [onset, setOnset] = useState<Onset>('hours');
  const [severity, setSeverity] = useState(5);
  const [duration, setDuration] = useState<Duration>('constant');
  const [triggers, setTriggers] = useState<Trigger[]>([]);

  const handleOnsetSelect = (value: Onset) => {
    setOnset(value);
    updateData();
  };

  const handleSeverityChange = (value: number) => {
    setSeverity(Math.round(value));
    updateData();
  };

  const handleDurationSelect = (value: Duration) => {
    setDuration(value);
    updateData();
  };

  const handleTriggerToggle = (trigger: Trigger) => {
    setTriggers(prev => {
      const newTriggers = prev.includes(trigger)
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger];
      return newTriggers;
    });
    updateData();
  };

  const updateData = () => {
    if (selectedSymptom) {
      onDataChange?.({
        symptomDetails: {
          id: selectedSymptom.id,
          onset,
          severity,
          duration,
          triggers,
        },
      });
    }
  };

  const renderOnsetOptions = () => {
    const options: Onset[] = ['hours', 'days', 'weeks', 'months'];
    return (
      <View style={styles.optionsContainer}>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              {
                backgroundColor: onset === option ? colors.primary : colors.card,
              },
            ]}
            onPress={() => handleOnsetSelect(option)}
          >
            <Text
              style={[
                styles.optionText,
                { color: onset === option ? colors.textInverted : colors.text },
              ]}
            >
              {t(`symptoms.onset.${option}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderDurationOptions = () => {
    const options: Duration[] = ['constant', 'intermittent'];
    return (
      <View style={styles.optionsContainer}>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              {
                backgroundColor: duration === option ? colors.primary : colors.card,
              },
            ]}
            onPress={() => handleDurationSelect(option)}
          >
            <Text
              style={[
                styles.optionText,
                { color: duration === option ? colors.textInverted : colors.text },
              ]}
            >
              {t(`symptoms.duration.${option}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderTriggerOptions = () => {
    const options: Trigger[] = ['movement', 'rest', 'food', 'stress', 'weather', 'other'];
    return (
      <View style={styles.optionsContainer}>
        {options.map(trigger => (
          <TouchableOpacity
            key={trigger}
            style={[
              styles.optionButton,
              {
                backgroundColor: triggers.includes(trigger) ? colors.primary : colors.card,
              },
            ]}
            onPress={() => handleTriggerToggle(trigger)}
          >
            <Text
              style={[
                styles.optionText,
                { color: triggers.includes(trigger) ? colors.textInverted : colors.text },
              ]}
            >
              {t(`symptoms.triggers.${trigger}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('symptoms.details.onset')}
        </Text>
        {renderOnsetOptions()}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('symptoms.details.severity')}
        </Text>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={severity}
            onValueChange={handleSeverityChange}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />
          <View style={styles.sliderLabels}>
            <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>
              {t('symptoms.severity.mild')}
            </Text>
            <Text style={[styles.sliderValue, { color: colors.text }]}>
              {severity}
            </Text>
            <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>
              {t('symptoms.severity.severe')}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('symptoms.details.duration')}
        </Text>
        {renderDurationOptions()}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('symptoms.details.triggers')}
        </Text>
        {renderTriggerOptions()}
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
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    margin: 4,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sliderContainer: {
    paddingHorizontal: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -8,
  },
  sliderLabel: {
    fontSize: 12,
  },
  sliderValue: {
    fontSize: 18,
    fontWeight: '600',
  },
}); 