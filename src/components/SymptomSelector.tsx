import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { Symptom } from '@hooks/useSymptomAnalysis';
import Slider from '@react-native-community/slider';

interface SymptomSelectorProps {
  suggestions: string[];
  selectedSymptoms: Symptom[];
  onAddSymptom: (name: string, severity: number, frequency: string) => void;
  onUpdateSymptom: (id: string, updates: Partial<Symptom>) => void;
  onRemoveSymptom: (id: string) => void;
}

const FREQUENCIES = ['Rarely', 'Sometimes', 'Often', 'Always'];

export const SymptomSelector: React.FC<SymptomSelectorProps> = ({
  suggestions,
  selectedSymptoms,
  onAddSymptom,
  onUpdateSymptom,
  onRemoveSymptom,
}) => {
  const { colors } = useTheme();
  const [selectedFrequency, setSelectedFrequency] = useState('Sometimes');

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Select Symptoms
      </Text>

      {suggestions.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.suggestionsContainer}
        >
          {suggestions.map((suggestion) => (
            <TouchableOpacity
              key={suggestion}
              style={[styles.suggestionChip, { backgroundColor: colors.card }]}
              onPress={() => onAddSymptom(suggestion, 5, selectedFrequency)}
            >
              <Text style={[styles.suggestionText, { color: colors.text }]}>
                {suggestion}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <ScrollView style={styles.selectedContainer}>
        {selectedSymptoms.map((symptom) => (
          <View
            key={symptom.id}
            style={[styles.symptomCard, { backgroundColor: colors.card }]}
          >
            <View style={styles.symptomHeader}>
              <Text style={[styles.symptomName, { color: colors.text }]}>
                {symptom.name}
              </Text>
              <TouchableOpacity
                onPress={() => onRemoveSymptom(symptom.id)}
                style={styles.removeButton}
              >
                <Text style={{ color: colors.error }}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Severity: {symptom.severity}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={symptom.severity}
              onValueChange={(value) =>
                onUpdateSymptom(symptom.id, { severity: value })
              }
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border}
            />

            <View style={styles.frequencyContainer}>
              {FREQUENCIES.map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.frequencyChip,
                    {
                      backgroundColor:
                        symptom.frequency === freq
                          ? colors.primary
                          : colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() =>
                    onUpdateSymptom(symptom.id, { frequency: freq })
                  }
                >
                  <Text
                    style={[
                      styles.frequencyText,
                      {
                        color:
                          symptom.frequency === freq
                            ? '#FFFFFF'
                            : colors.text,
                      },
                    ]}
                  >
                    {freq}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  suggestionsContainer: {
    flexGrow: 0,
    marginBottom: 16,
  },
  suggestionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 14,
  },
  selectedContainer: {
    flex: 1,
  },
  symptomCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  symptomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  symptomName: {
    fontSize: 16,
    fontWeight: '500',
  },
  removeButton: {
    padding: 4,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  frequencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  frequencyChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  frequencyText: {
    fontSize: 12,
  },
}); 