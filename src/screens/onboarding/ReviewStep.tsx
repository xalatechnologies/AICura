import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { UserProfile } from './types';

interface ReviewStepProps {
  profile: UserProfile;
  onEditSection: (section: number) => void;
}

export const ReviewStep = React.memo(({ profile, onEditSection }: ReviewStepProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={styles.stepContent}>
      <View style={styles.reviewSection}>
        <View style={styles.reviewHeader}>
          <Text style={[styles.reviewTitle, { color: colors.text }]}>
            {t('onboarding.review.personalInfo')}
          </Text>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.primary }]}
            onPress={() => onEditSection(1)}
          >
            <Icon name="pencil" size={20} color="#fff" />
            <Text style={styles.editButtonText}>{t('onboarding.edit.title')}</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.reviewItem, { backgroundColor: colors.card }]}>
          <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>
            {t('onboarding.userDetails.name')}
          </Text>
          <Text style={[styles.reviewValue, { color: colors.text }]}>
            {profile.name}
          </Text>
        </View>
        <View style={[styles.reviewItem, { backgroundColor: colors.card }]}>
          <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>
            {t('onboarding.userDetails.age')}
          </Text>
          <Text style={[styles.reviewValue, { color: colors.text }]}>
            {profile.age}
          </Text>
        </View>
        <View style={[styles.reviewItem, { backgroundColor: colors.card }]}>
          <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>
            {t('onboarding.userDetails.gender')}
          </Text>
          <Text style={[styles.reviewValue, { color: colors.text }]}>
            {t(`onboarding.userDetails.genders.${profile.gender}`)}
          </Text>
        </View>
      </View>

      <View style={styles.reviewSection}>
        <View style={styles.reviewHeader}>
          <Text style={[styles.reviewTitle, { color: colors.text }]}>
            {t('onboarding.review.medicalHistory')}
          </Text>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.primary }]}
            onPress={() => onEditSection(2)}
          >
            <Icon name="pencil" size={20} color="#fff" />
            <Text style={styles.editButtonText}>{t('onboarding.edit.title')}</Text>
          </TouchableOpacity>
        </View>
        {profile.medicalHistory.conditions.length > 0 && (
          <View style={[styles.reviewItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>
              {t('onboarding.medicalHistory.conditions')}
            </Text>
            <View style={styles.chipList}>
              {profile.medicalHistory.conditions.map((condition) => (
                <View
                  key={condition}
                  style={[styles.reviewChip, { backgroundColor: colors.primary }]}
                >
                  <Text style={styles.reviewChipText}>
                    {t(`onboarding.medicalHistory.conditions.${condition}`)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
        {profile.medicalHistory.allergies.length > 0 && (
          <View style={[styles.reviewItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>
              {t('onboarding.medicalHistory.allergies.title')}
            </Text>
            <View style={styles.chipList}>
              {profile.medicalHistory.allergies.map((allergy) => (
                <View
                  key={allergy}
                  style={[styles.reviewChip, { backgroundColor: colors.primary }]}
                >
                  <Text style={styles.reviewChipText}>{allergy}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        {profile.medicalHistory.medications.length > 0 && (
          <View style={[styles.reviewItem, { backgroundColor: colors.card }]}>
            <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>
              {t('onboarding.medicalHistory.medications.title')}
            </Text>
            {profile.medicalHistory.medications.map((med, index) => (
              <View key={index} style={styles.medicationReview}>
                <Text style={[styles.medicationName, { color: colors.text }]}>
                  {med.name}
                </Text>
                <Text style={[styles.medicationDetails, { color: colors.textSecondary }]}>
                  {med.dosage} - {t(`onboarding.medicalHistory.medications.frequencies.${med.frequency}`)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.reviewSection}>
        <View style={styles.reviewHeader}>
          <Text style={[styles.reviewTitle, { color: colors.text }]}>
            {t('onboarding.review.lifestyle')}
          </Text>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.primary }]}
            onPress={() => onEditSection(3)}
          >
            <Icon name="pencil" size={20} color="#fff" />
            <Text style={styles.editButtonText}>{t('onboarding.edit.title')}</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.reviewItem, { backgroundColor: colors.card }]}>
          <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>
            {t('onboarding.lifestyle.smoking')}
          </Text>
          <Text style={[styles.reviewValue, { color: colors.text }]}>
            {profile.lifestyle.smoking
              ? t('onboarding.lifestyle.smoker')
              : t('onboarding.lifestyle.nonSmoker')}
          </Text>
        </View>
        <View style={[styles.reviewItem, { backgroundColor: colors.card }]}>
          <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>
            {t('onboarding.lifestyle.activity')}
          </Text>
          <Text style={[styles.reviewValue, { color: colors.text }]}>
            {t(`onboarding.lifestyle.activityLevels.${profile.lifestyle.activity}`)}
          </Text>
        </View>
        <View style={[styles.reviewItem, { backgroundColor: colors.card }]}>
          <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>
            {t('onboarding.lifestyle.alcohol')}
          </Text>
          <Text style={[styles.reviewValue, { color: colors.text }]}>
            {t(`onboarding.lifestyle.alcoholFrequency.${profile.lifestyle.alcohol}`)}
          </Text>
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
  reviewSection: {
    marginBottom: 24,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  reviewItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
  },
  reviewLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  reviewValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  chipList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  reviewChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  reviewChipText: {
    color: '#fff',
    fontSize: 14,
  },
  medicationReview: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  medicationDetails: {
    fontSize: 14,
  },
}); 