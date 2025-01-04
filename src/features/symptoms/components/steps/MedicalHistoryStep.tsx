import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

interface MedicalHistoryStepProps {
  onDataChange?: (data: any) => void;
}

type Condition = {
  id: string;
  name: string;
};

type Allergy = {
  id: string;
  name: string;
};

type Medication = {
  id: string;
  name: string;
  dosage?: string;
};

export const MedicalHistoryStep: React.FC<MedicalHistoryStepProps> = ({
  onDataChange,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [conditions, setConditions] = useState<Condition[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newMedicationDosage, setNewMedicationDosage] = useState('');

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      const condition = {
        id: Date.now().toString(),
        name: newCondition.trim(),
      };
      setConditions(prev => [...prev, condition]);
      setNewCondition('');
      updateData([...conditions, condition], allergies, medications);
    }
  };

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      const allergy = {
        id: Date.now().toString(),
        name: newAllergy.trim(),
      };
      setAllergies(prev => [...prev, allergy]);
      setNewAllergy('');
      updateData(conditions, [...allergies, allergy], medications);
    }
  };

  const handleAddMedication = () => {
    if (newMedication.trim()) {
      const medication = {
        id: Date.now().toString(),
        name: newMedication.trim(),
        dosage: newMedicationDosage.trim() || undefined,
      };
      setMedications(prev => [...prev, medication]);
      setNewMedication('');
      setNewMedicationDosage('');
      updateData(conditions, allergies, [...medications, medication]);
    }
  };

  const handleRemoveCondition = (id: string) => {
    setConditions(prev => {
      const updated = prev.filter(c => c.id !== id);
      updateData(updated, allergies, medications);
      return updated;
    });
  };

  const handleRemoveAllergy = (id: string) => {
    setAllergies(prev => {
      const updated = prev.filter(a => a.id !== id);
      updateData(conditions, updated, medications);
      return updated;
    });
  };

  const handleRemoveMedication = (id: string) => {
    setMedications(prev => {
      const updated = prev.filter(m => m.id !== id);
      updateData(conditions, allergies, updated);
      return updated;
    });
  };

  const updateData = (
    updatedConditions: Condition[],
    updatedAllergies: Allergy[],
    updatedMedications: Medication[]
  ) => {
    onDataChange?.({
      medicalHistory: {
        conditions: updatedConditions,
        allergies: updatedAllergies,
        medications: updatedMedications,
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('symptoms.medicalHistory.conditions')}
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            value={newCondition}
            onChangeText={setNewCondition}
            placeholder={t('symptoms.medicalHistory.conditionPlaceholder')}
            placeholderTextColor={colors.textSecondary}
            onSubmitEditing={handleAddCondition}
          />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={handleAddCondition}
          >
            <Icon name="add" size={24} color={colors.textInverted} />
          </TouchableOpacity>
        </View>
        <View style={styles.chipContainer}>
          {conditions.map(condition => (
            <View
              key={condition.id}
              style={[styles.chip, { backgroundColor: colors.card }]}
            >
              <Text style={[styles.chipText, { color: colors.text }]}>
                {condition.name}
              </Text>
              <TouchableOpacity
                onPress={() => handleRemoveCondition(condition.id)}
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
          {t('symptoms.medicalHistory.allergies')}
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            value={newAllergy}
            onChangeText={setNewAllergy}
            placeholder={t('symptoms.medicalHistory.allergyPlaceholder')}
            placeholderTextColor={colors.textSecondary}
            onSubmitEditing={handleAddAllergy}
          />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={handleAddAllergy}
          >
            <Icon name="add" size={24} color={colors.textInverted} />
          </TouchableOpacity>
        </View>
        <View style={styles.chipContainer}>
          {allergies.map(allergy => (
            <View
              key={allergy.id}
              style={[styles.chip, { backgroundColor: colors.card }]}
            >
              <Text style={[styles.chipText, { color: colors.text }]}>
                {allergy.name}
              </Text>
              <TouchableOpacity
                onPress={() => handleRemoveAllergy(allergy.id)}
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
          {t('symptoms.medicalHistory.medications')}
        </Text>
        <View style={styles.medicationInputContainer}>
          <View style={styles.medicationInputs}>
            <TextInput
              style={[
                styles.medicationNameInput,
                { backgroundColor: colors.card, color: colors.text },
              ]}
              value={newMedication}
              onChangeText={setNewMedication}
              placeholder={t('symptoms.medicalHistory.medicationPlaceholder')}
              placeholderTextColor={colors.textSecondary}
            />
            <TextInput
              style={[
                styles.medicationDosageInput,
                { backgroundColor: colors.card, color: colors.text },
              ]}
              value={newMedicationDosage}
              onChangeText={setNewMedicationDosage}
              placeholder={t('symptoms.medicalHistory.dosagePlaceholder')}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={handleAddMedication}
          >
            <Icon name="add" size={24} color={colors.textInverted} />
          </TouchableOpacity>
        </View>
        <View style={styles.chipContainer}>
          {medications.map(medication => (
            <View
              key={medication.id}
              style={[styles.chip, { backgroundColor: colors.card }]}
            >
              <Text style={[styles.chipText, { color: colors.text }]}>
                {medication.name}
                {medication.dosage && ` (${medication.dosage})`}
              </Text>
              <TouchableOpacity
                onPress={() => handleRemoveMedication(medication.id)}
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
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    fontSize: 16,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
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
  removeButton: {
    padding: 2,
  },
  medicationInputContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  medicationInputs: {
    flex: 1,
    marginRight: 8,
  },
  medicationNameInput: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    fontSize: 16,
  },
  medicationDosageInput: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
}); 