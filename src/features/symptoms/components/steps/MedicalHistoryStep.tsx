import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { getAISuggestions } from '@/services/ai';

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

type SuggestionType = {
  id: string;
  name: string;
};

export const MedicalHistoryStep: React.FC<MedicalHistoryStepProps> = ({
  onDataChange,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [conditionInput, setConditionInput] = useState('');
  const [allergyInput, setAllergyInput] = useState('');
  const [medicationInput, setMedicationInput] = useState('');
  const [medicationDosage, setMedicationDosage] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionType[]>([]);
  const [activeField, setActiveField] = useState<'conditions' | 'allergies' | 'medications' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 12,
      marginBottom: 8,
    },
    searchIcon: {
      marginRight: 8,
    },
    input: {
      flex: 1,
      height: 48,
      fontSize: 16,
      color: colors.text,
    },
    dosageInput: {
      height: 48,
      borderRadius: 12,
      paddingHorizontal: 16,
      fontSize: 16,
      marginTop: 8,
      backgroundColor: colors.card,
      color: colors.text,
    },
    addButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 8,
      backgroundColor: colors.primary,
    },
    chipContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
      gap: 8,
    },
    chipWrapper: {
      marginVertical: 2,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: colors.primary,
    },
    chipText: {
      fontSize: 14,
      marginRight: 4,
      fontWeight: '500',
      color: colors.textInverted,
    },
    removeButton: {
      padding: 2,
    },
    suggestions: {
      maxHeight: 200,
      borderRadius: 12,
      marginTop: 8,
      marginBottom: 16,
      backgroundColor: colors.card,
    },
    suggestionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    suggestionIcon: {
      marginRight: 8,
    },
    suggestionText: {
      fontSize: 16,
      color: colors.text,
    },
    medicationInputContainer: {
      marginBottom: 16,
    },
  });

  const handleAddCondition = () => {
    if (conditionInput.trim()) {
      const condition = {
        id: Date.now().toString(),
        name: conditionInput.trim(),
      };
      setConditions(prev => [...prev, condition]);
      setConditionInput('');
      updateData([...conditions, condition], allergies, medications);
    }
  };

  const handleAddAllergy = () => {
    if (allergyInput.trim()) {
      const allergy = {
        id: Date.now().toString(),
        name: allergyInput.trim(),
      };
      setAllergies(prev => [...prev, allergy]);
      setAllergyInput('');
      updateData(conditions, [...allergies, allergy], medications);
    }
  };

  const handleAddMedication = () => {
    if (medicationInput.trim()) {
      const medication = {
        id: Date.now().toString(),
        name: medicationInput.trim(),
        dosage: medicationDosage.trim() || undefined,
      };
      setMedications(prev => [...prev, medication]);
      setMedicationInput('');
      setMedicationDosage('');
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

  const fetchSuggestions = useCallback(async (input: string, type: 'conditions' | 'allergies' | 'medications') => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await getAISuggestions(input, type);
      setSuggestions(results.map((text, index) => ({
        id: `${index}-${text}`,
        name: text,
      })));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renderInputField = (
    value: string,
    onChange: (text: string) => void,
    placeholder: string,
    type: 'conditions' | 'allergies' | 'medications',
    onAdd: () => void
  ) => (
    <View style={styles.searchContainer}>
      <Icon name="search-outline" size={20} color={colors.textSecondary} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(text) => {
          onChange(text);
          setActiveField(type);
          fetchSuggestions(text, type);
        }}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        onFocus={() => setActiveField(type)}
      />
      {value.trim() && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={onAdd}
        >
          <Icon name="add" size={24} color={colors.textInverted} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderChips = (items: (Condition | Allergy | Medication)[], onRemove: (id: string) => void) => (
    <View style={styles.chipContainer}>
      {items.map(item => (
        <Animated.View
          key={item.id}
          style={styles.chipWrapper}
        >
          <LinearGradient
            colors={[colors.primary, colors.primary + 'DD']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.chip}
          >
            <Text style={styles.chipText}>
              {item.name}
              {'dosage' in item && item.dosage && ` (${item.dosage})`}
            </Text>
            <TouchableOpacity
              onPress={() => onRemove(item.id)}
              style={styles.removeButton}
            >
              <Icon name="close-circle" size={20} color={colors.textInverted} />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderInputField(
        conditionInput,
        setConditionInput,
        t('symptoms.medicalHistory.conditionPlaceholder'),
        'conditions',
        handleAddCondition
      )}
      {renderChips(conditions, handleRemoveCondition)}

      {renderInputField(
        allergyInput,
        setAllergyInput,
        t('symptoms.medicalHistory.allergyPlaceholder'),
        'allergies',
        handleAddAllergy
      )}
      {renderChips(allergies, handleRemoveAllergy)}

      <View style={styles.medicationInputContainer}>
        {renderInputField(
          medicationInput,
          setMedicationInput,
          t('symptoms.medicalHistory.medicationPlaceholder'),
          'medications',
          handleAddMedication
        )}
        {medicationInput.trim() && (
          <TextInput
            style={styles.dosageInput}
            value={medicationDosage}
            onChangeText={setMedicationDosage}
            placeholder={t('symptoms.medicalHistory.dosagePlaceholder')}
            placeholderTextColor={colors.textSecondary}
          />
        )}
      </View>
      {renderChips(medications, handleRemoveMedication)}

      {suggestions.length > 0 && activeField && (
        <FlatList
          style={styles.suggestions}
          data={suggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => {
                switch (activeField) {
                  case 'conditions':
                    setConditionInput(item.name);
                    handleAddCondition();
                    break;
                  case 'allergies':
                    setAllergyInput(item.name);
                    handleAddAllergy();
                    break;
                  case 'medications':
                    setMedicationInput(item.name);
                    break;
                }
                setSuggestions([]);
              }}
            >
              <Icon name="add-circle-outline" size={20} color={colors.primary} style={styles.suggestionIcon} />
              <Text style={styles.suggestionText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}; 