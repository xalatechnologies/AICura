import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@theme/ThemeContext';
import { UserProfile } from './types';

interface LifestyleStepProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

const ACTIVITY_LEVELS = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
const ALCOHOL_FREQUENCY = ['none', 'occasional', 'moderate', 'frequent'];

export const LifestyleStep = React.memo(({ profile, onUpdateProfile }: LifestyleStepProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={styles.stepContent}>
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>
          {t('onboarding.lifestyle.smoking')}
        </Text>
        <View style={styles.switchContainer}>
          <Switch
            value={profile.lifestyle.smoking}
            onValueChange={(value) =>
              onUpdateProfile({
                lifestyle: { ...profile.lifestyle, smoking: value },
              })
            }
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
          />
          <Text style={[styles.switchLabel, { color: colors.text }]}>
            {profile.lifestyle.smoking
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
                  backgroundColor: profile.lifestyle.activity === level 
                    ? colors.primary 
                    : colors.card,
                },
              ]}
              onPress={() =>
                onUpdateProfile({
                  lifestyle: { ...profile.lifestyle, activity: level },
                })
              }
            >
              <Text
                style={[
                  styles.optionText,
                  { 
                    color: profile.lifestyle.activity === level 
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
                  backgroundColor: profile.lifestyle.alcohol === frequency 
                    ? colors.primary 
                    : colors.card,
                },
              ]}
              onPress={() =>
                onUpdateProfile({
                  lifestyle: { ...profile.lifestyle, alcohol: frequency },
                })
              }
            >
              <Text
                style={[
                  styles.optionText,
                  { 
                    color: profile.lifestyle.alcohol === frequency 
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