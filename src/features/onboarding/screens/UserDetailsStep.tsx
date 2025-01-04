import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@theme/ThemeContext';

interface UserDetailsStepProps {
  profile: {
    name: string;
    age: string;
    gender: string;
  };
  onUpdateProfile: (updates: Partial<{ name: string; age: string; gender: string }>) => void;
}

const GENDER_OPTIONS = ['male', 'female', 'other'];

export const UserDetailsStep = React.memo(({ profile, onUpdateProfile }: UserDetailsStepProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={styles.stepContent}>
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>
          {t('onboarding.userDetails.name')}
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          placeholder={t('onboarding.userDetails.namePlaceholder')}
          placeholderTextColor={colors.textSecondary}
          value={profile.name}
          onChangeText={(text) => onUpdateProfile({ name: text })}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>
          {t('onboarding.userDetails.age')}
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          placeholder={t('onboarding.userDetails.agePlaceholder')}
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={profile.age}
          onChangeText={(text) => onUpdateProfile({ age: text })}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>
          {t('onboarding.userDetails.gender')}
        </Text>
        <View style={styles.optionsContainer}>
          {GENDER_OPTIONS.map((gender) => (
            <TouchableOpacity
              key={gender}
              style={[
                styles.optionButton,
                { 
                  backgroundColor: profile.gender === gender ? colors.primary : colors.card,
                },
              ]}
              onPress={() => onUpdateProfile({ gender })}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: profile.gender === gender ? '#fff' : colors.text },
                ]}
              >
                {t(`onboarding.userDetails.genders.${gender}`)}
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
  input: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
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