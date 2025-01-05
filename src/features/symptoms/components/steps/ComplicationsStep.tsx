import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  FlatList,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { getAISuggestions } from '@/services/ai';

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
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [activeField, setActiveField] = useState<'complications' | 'symptoms' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggestions = useCallback(async (input: string, type: 'complications' | 'symptoms') => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await getAISuggestions(input, type === 'complications' ? 'conditions' : 'symptoms');
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

  const renderSeverityButtons = () => (
    <View style={styles.severityContainer}>
      {severityOptions.map(severity => (
        <TouchableOpacity
          key={severity}
          style={[
            styles.severityButton,
            {
              backgroundColor:
                selectedSeverity === severity ? colors.primary : colors.card,
              borderWidth: 1,
              borderColor: selectedSeverity === severity ? colors.primary : colors.border,
            },
          ]}
          onPress={() => setSelectedSeverity(severity)}
        >
          <Icon
            name={selectedSeverity === severity ? 'checkmark-circle' : 'radio-button-off'}
            size={18}
            color={selectedSeverity === severity ? colors.textInverted : colors.text}
            style={styles.severityIcon}
          />
          <Text
            style={[
              styles.severityText,
              {
                color: selectedSeverity === severity ? colors.textInverted : colors.text,
              },
            ]}
          >
            {t(`symptoms.severity.${severity}`)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderInputField = (
    value: string,
    onChange: (text: string) => void,
    placeholder: string,
    type: 'complications' | 'symptoms',
    onAdd: () => void
  ) => (
    <View style={styles.searchContainer}>
      <Icon name="search-outline" size={20} color={colors.textSecondary} style={styles.searchIcon} />
      <TextInput
        style={[styles.input, { color: colors.text }]}
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
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={onAdd}
        >
          <Icon name="add" size={24} color={colors.textInverted} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderChips = (items: any[], onRemove: (id: string) => void, showSeverity?: boolean) => (
    <View style={styles.chipContainer}>
      {items.map(item => (
        <Animated.View
          key={item.id}
          style={[styles.chipWrapper]}
        >
          <LinearGradient
            colors={[colors.primary, colors.primary + 'DD']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.chip}
          >
            <Text style={[styles.chipText, { color: colors.textInverted }]}>
              {item.name}
              {showSeverity && item.severity && (
                <Text style={styles.severityIndicator}>
                  {` • ${t(`symptoms.severity.${item.severity}`)}`}
                </Text>
              )}
              {item.description && (
                <Text style={styles.description}>
                  {` • ${item.description}`}
                </Text>
              )}
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
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        {renderInputField(
          newComplication,
          setNewComplication,
          t('symptoms.complications.placeholder'),
          'complications',
          handleAddComplication
        )}
        {newComplication.trim() && renderSeverityButtons()}
        {renderChips(complications, handleRemoveComplication, true)}
      </View>

      <View style={styles.section}>
        {renderInputField(
          newSymptom,
          setNewSymptom,
          t('symptoms.additionalSymptoms.namePlaceholder'),
          'symptoms',
          handleAddSymptom
        )}
        {newSymptom.trim() && (
          <TextInput
            style={[styles.descriptionInput, { backgroundColor: colors.card, color: colors.text }]}
            value={newSymptomDescription}
            onChangeText={setNewSymptomDescription}
            placeholder={t('symptoms.additionalSymptoms.descriptionPlaceholder')}
            placeholderTextColor={colors.textSecondary}
            multiline
          />
        )}
        {renderChips(additionalSymptoms, handleRemoveSymptom)}
      </View>

      {suggestions.length > 0 && activeField && (
        <FlatList
          style={[styles.suggestions, { backgroundColor: colors.card }]}
          data={suggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.suggestionItem, { borderBottomColor: colors.border }]}
              onPress={() => {
                if (activeField === 'complications') {
                  setNewComplication(item.name);
                } else {
                  setNewSymptom(item.name);
                }
                setSuggestions([]);
              }}
            >
              <Icon name="add-circle-outline" size={20} color={colors.primary} style={styles.suggestionIcon} />
              <Text style={[styles.suggestionText, { color: colors.text }]}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  descriptionInput: {
    height: 80,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 16,
    marginBottom: 8,
    textAlignVertical: 'top',
  },
  severityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  severityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flex: 1,
    minWidth: 100,
  },
  severityIcon: {
    marginRight: 8,
  },
  severityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  },
  chipText: {
    fontSize: 14,
    marginRight: 4,
    fontWeight: '500',
  },
  severityIndicator: {
    fontSize: 12,
    opacity: 0.9,
  },
  description: {
    fontSize: 12,
    opacity: 0.9,
  },
  removeButton: {
    padding: 2,
  },
  suggestions: {
    maxHeight: 200,
    borderRadius: 12,
    margin: 16,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  suggestionIcon: {
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 16,
  },
}); 