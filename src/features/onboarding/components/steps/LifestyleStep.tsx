import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@theme/ThemeContext';

interface LifestyleStepProps {
  onDataChange?: (data: any) => void;
}

const ACTIVITY_LEVELS = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
const ALCOHOL_FREQUENCY = ['none', 'occasional', 'moderate', 'frequent'];

export const LifestyleStep = React.memo(({ onDataChange }: LifestyleStepProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    smoking: false,
    activity: 'moderate',
    alcohol: 'none',
  });

  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  const handleUpdate = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <View style={styles.stepContent}>
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>
          {t('onboarding.lifestyle.smoking')}
        </Text>
        <View style={styles.switchContainer}>
          <Switch
            value={formData.smoking}
            onValueChange={(value) => handleUpdate({ smoking: value })}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
          />
          <Text style={[styles.switchLabel, { color: colors.text }]}>
            {formData.smoking
              ? t('onboarding.lifestyle.smoker')
              : t('onboarding.lifestyle.nonSmoker')}
          </Text>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>
          {t('onboarding.lifestyle.activity')}
        </Text>
        <View style={styles.optionsContainer}>
          {ACTIVITY_LEVELS.map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.optionButton,
                { 
                  backgroundColor: formData.activity === level 
                    ? colors.primary 
                    : colors.card,
                },
              ]}
              onPress={() => handleUpdate({ activity: level })}
            >
              <Text
                style={[
                  styles.optionText,
                  { 
                    color: formData.activity === level 
                      ? '#fff' 
                      : colors.text,
                  },
                ]}
              >
                {t(`onboarding.lifestyle.activityLevels.${level}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>
          {t('onboarding.lifestyle.alcohol')}
        </Text>
        <View style={styles.optionsContainer}>
          {ALCOHOL_FREQUENCY.map((frequency) => (
            <TouchableOpacity
              key={frequency}
              style={[
                styles.optionButton,
                { 
                  backgroundColor: formData.alcohol === frequency 
                    ? colors.primary 
                    : colors.card,
                },
              ]}
              onPress={() => handleUpdate({ alcohol: frequency })}
            >
              <Text
                style={[
                  styles.optionText,
                  { 
                    color: formData.alcohol === frequency 
                      ? '#fff' 
                      : colors.text,
                  },
                ]}
              >
                {t(`onboarding.lifestyle.alcoholFrequency.${frequency}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  stepContent: {
    flex: 1,
    paddingVertical: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  switchLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  optionButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    margin: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 