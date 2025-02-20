import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { Medication, UserProfile } from './types';

interface MedicalHistoryStepProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

const COMMON_CONDITIONS = [
  'diabetes',
  'hypertension',
  'asthma',
  'heart_disease',
  'arthritis',
  'other'
];

const COMMON_ALLERGIES = ['pollen', 'dust', 'nuts', 'lactose', 'gluten', 'shellfish'];
const MEDICATION_FREQUENCIES = ['daily', 'weekly', 'asNeeded'] as const;

export const MedicalHistoryStep = React.memo(({ profile, onUpdateProfile }: MedicalHistoryStepProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState<Medication>({
    name: '',
    dosage: '',
    frequency: 'daily'
  });

  const handleAddAllergy = () => {
    if (!newAllergy.trim()) return;

    const updatedAllergies = [...profile.medicalHistory.allergies, newAllergy.trim()];
    onUpdateProfile({
      medicalHistory: {
        ...profile.medicalHistory,
        allergies: updatedAllergies
      }
    });
    setNewAllergy('');
  };

  const handleAddMedication = () => {
    if (!newMedication.name.trim() || !newMedication.dosage.trim()) return;

    const updatedMedications = [...profile.medicalHistory.medications, { ...newMedication }];
    onUpdateProfile({
      medicalHistory: {
        ...profile.medicalHistory,
        medications: updatedMedications
      }
    });
    setNewMedication({ name: '', dosage: '', frequency: 'daily' });
  };

  const handleRemoveMedication = (index: number) => {
    const updatedMedications = [...profile.medicalHistory.medications];
    updatedMedications.splice(index, 1);
    onUpdateProfile({
      medicalHistory: {
        ...profile.medicalHistory,
        medications: updatedMedications
      }
    });
  };

  return (
    <View style={styles.stepContent}>
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>
          {t('onboarding.medicalHistory.conditions')}
        </Text>
        <View style={styles.checkboxContainer}>
          {COMMON_CONDITIONS.map((condition) => (
            <TouchableOpacity
              key={condition}
              style={[
                styles.checkbox,
                { 
                  backgroundColor: profile.medicalHistory.conditions.includes(condition) 
                    ? colors.primary 
                    : colors.card,
                },
              ]}
              onPress={() => {
                const conditions = profile.medicalHistory.conditions.includes(condition)
                  ? profile.medicalHistory.conditions.filter(c => c !== condition)
                  : [...profile.medicalHistory.conditions, condition];
                onUpdateProfile({
                  medicalHistory: { ...profile.medicalHistory, conditions },
                });
              }}
            >
              <Icon
                name={profile.medicalHistory.conditions.includes(condition) ? 'checkmark' : 'add'}
                size={24}
                color={profile.medicalHistory.conditions.includes(condition) ? '#fff' : colors.text}
              />
              <Text
                style={[
                  styles.checkboxText,
                  { 
                    color: profile.medicalHistory.conditions.includes(condition) 
                      ? '#fff' 
                      : colors.text,
                  },
                ]}
              >
                {t(`onboarding.medicalHistory.conditions.${condition}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>
          {t('onboarding.medicalHistory.allergies.title')}
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            placeholder={t('onboarding.medicalHistory.allergies.placeholder')}
            placeholderTextColor={colors.textSecondary}
            value={newAllergy}
            onChangeText={setNewAllergy}
          />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={handleAddAllergy}
          >
            <Icon name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.chipContainer}>
          {COMMON_ALLERGIES.map((allergy) => (
            <TouchableOpacity
              key={allergy}
              style={[
                styles.chip,
                {
                  backgroundColor: profile.medicalHistory.allergies.includes(allergy)
                    ? colors.primary
                    : colors.card
                }
              ]}
              onPress={() => {
                const allergies = profile.medicalHistory.allergies.includes(allergy)
                  ? profile.medicalHistory.allergies.filter(a => a !== allergy)
                  : [...profile.medicalHistory.allergies, allergy];
                onUpdateProfile({
                  medicalHistory: { ...profile.medicalHistory, allergies }
                });
              }}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: profile.medicalHistory.allergies.includes(allergy)
                      ? '#fff'
                      : colors.text
                  }
                ]}
              >
                {t(`onboarding.medicalHistory.allergies.common.${allergy}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>
          {t('onboarding.medicalHistory.medications.title')}
        </Text>
        <View style={styles.medicationForm}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            placeholder={t('onboarding.medicalHistory.medications.placeholder')}
            placeholderTextColor={colors.textSecondary}
            value={newMedication.name}
            onChangeText={(text) => setNewMedication({ ...newMedication, name: text })}
          />

          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            placeholder={t('onboarding.medicalHistory.medications.dosage')}
            placeholderTextColor={colors.textSecondary}
            value={newMedication.dosage}
            onChangeText={(text) => setNewMedication({ ...newMedication, dosage: text })}
          />

          <View style={styles.frequencyContainer}>
            {MEDICATION_FREQUENCIES.map((freq) => (
              <TouchableOpacity
                key={freq}
                style={[
                  styles.frequencyButton,
                  {
                    backgroundColor: newMedication.frequency === freq
                      ? colors.primary
                      : colors.card
                  }
                ]}
                onPress={() => setNewMedication({ ...newMedication, frequency: freq })}
              >
                <Text
                  style={[
                    styles.frequencyText,
                    {
                      color: newMedication.frequency === freq
                        ? '#fff'
                        : colors.text
                    }
                  ]}
                >
                  {t(`onboarding.medicalHistory.medications.frequencies.${freq}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.addMedicationButton, { backgroundColor: colors.primary }]}
            onPress={handleAddMedication}
          >
            <Text style={styles.addButtonText}>
              {t('onboarding.medicalHistory.medications.add')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.medicationList}>
          {profile.medicalHistory.medications.map((med, index) => (
            <View
              key={index}
              style={[styles.medicationItem, { backgroundColor: colors.card }]}
            >
              <View style={styles.medicationInfo}>
                <Text style={[styles.medicationName, { color: colors.text }]}>
                  {med.name}
                </Text>
                <Text style={[styles.medicationDetails, { color: colors.textSecondary }]}>
                  {med.dosage} - {t(`onboarding.medicalHistory.medications.frequencies.${med.frequency}`)}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleRemoveMedication(index)}>
                <Icon name="close-circle" size={24} color={colors.error} />
              </TouchableOpacity>
            </View>
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
  checkboxContainer: {
    marginTop: 10,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  chipText: {
    fontSize: 14,
  },
  medicationForm: {
    marginBottom: 16,
  },
  frequencyContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  frequencyText: {
    fontSize: 14,
  },
  addMedicationButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  medicationList: {
    marginTop: 16,
  },
  medicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  medicationInfo: {
    flex: 1,
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