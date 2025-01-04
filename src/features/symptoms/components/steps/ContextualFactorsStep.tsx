import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

interface ContextualFactorsStepProps {
  onDataChange?: (data: any) => void;
}

type Lifestyle = {
  smoking: boolean;
  alcohol: 'none' | 'occasional' | 'regular' | 'frequent';
  occupation: string;
};

type RecentChanges = {
  travel: boolean;
  travelDetails?: string;
  dietChange: boolean;
  dietDetails?: string;
};

type EnvironmentalFactor = {
  id: string;
  name: string;
};

export const ContextualFactorsStep: React.FC<ContextualFactorsStepProps> = ({
  onDataChange,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [lifestyle, setLifestyle] = useState<Lifestyle>({
    smoking: false,
    alcohol: 'none',
    occupation: '',
  });

  const [recentChanges, setRecentChanges] = useState<RecentChanges>({
    travel: false,
    dietChange: false,
  });

  const [environmentalFactors, setEnvironmentalFactors] = useState<EnvironmentalFactor[]>([]);
  const [newFactor, setNewFactor] = useState('');

  const alcoholOptions: Array<'none' | 'occasional' | 'regular' | 'frequent'> = [
    'none',
    'occasional',
    'regular',
    'frequent',
  ];

  const handleLifestyleChange = (updates: Partial<Lifestyle>) => {
    const updated = { ...lifestyle, ...updates };
    setLifestyle(updated);
    updateData(updated, recentChanges, environmentalFactors);
  };

  const handleRecentChanges = (updates: Partial<RecentChanges>) => {
    const updated = { ...recentChanges, ...updates };
    setRecentChanges(updated);
    updateData(lifestyle, updated, environmentalFactors);
  };

  const handleAddFactor = () => {
    if (newFactor.trim()) {
      const factor = {
        id: Date.now().toString(),
        name: newFactor.trim(),
      };
      const updated = [...environmentalFactors, factor];
      setEnvironmentalFactors(updated);
      setNewFactor('');
      updateData(lifestyle, recentChanges, updated);
    }
  };

  const handleRemoveFactor = (id: string) => {
    const updated = environmentalFactors.filter(f => f.id !== id);
    setEnvironmentalFactors(updated);
    updateData(lifestyle, recentChanges, updated);
  };

  const updateData = (
    lifestyleData: Lifestyle,
    changesData: RecentChanges,
    factorsData: EnvironmentalFactor[]
  ) => {
    onDataChange?.({
      contextualFactors: {
        lifestyle: lifestyleData,
        recentChanges: changesData,
        environmentalFactors: factorsData,
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('symptoms.contextual.lifestyle')}
        </Text>
        
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>
            {t('symptoms.contextual.smoking')}
          </Text>
          <Switch
            value={lifestyle.smoking}
            onValueChange={(value) => handleLifestyleChange({ smoking: value })}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>

        <Text style={[styles.label, { color: colors.text, marginTop: 16 }]}>
          {t('symptoms.contextual.alcohol')}
        </Text>
        <View style={styles.optionsContainer}>
          {alcoholOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                {
                  backgroundColor:
                    lifestyle.alcohol === option ? colors.primary : colors.card,
                },
              ]}
              onPress={() => handleLifestyleChange({ alcohol: option })}
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    color:
                      lifestyle.alcohol === option ? colors.textInverted : colors.text,
                  },
                ]}
              >
                {t(`symptoms.contextual.alcoholOptions.${option}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>
            {t('symptoms.contextual.occupation')}
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            value={lifestyle.occupation}
            onChangeText={(text) => handleLifestyleChange({ occupation: text })}
            placeholder={t('symptoms.contextual.occupationPlaceholder')}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('symptoms.contextual.recentChanges')}
        </Text>

        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>
            {t('symptoms.contextual.travel')}
          </Text>
          <Switch
            value={recentChanges.travel}
            onValueChange={(value) => handleRecentChanges({ travel: value })}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>

        {recentChanges.travel && (
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            value={recentChanges.travelDetails}
            onChangeText={(text) => handleRecentChanges({ travelDetails: text })}
            placeholder={t('symptoms.contextual.travelDetailsPlaceholder')}
            placeholderTextColor={colors.textSecondary}
          />
        )}

        <View style={[styles.row, { marginTop: 16 }]}>
          <Text style={[styles.label, { color: colors.text }]}>
            {t('symptoms.contextual.dietChange')}
          </Text>
          <Switch
            value={recentChanges.dietChange}
            onValueChange={(value) => handleRecentChanges({ dietChange: value })}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>

        {recentChanges.dietChange && (
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            value={recentChanges.dietDetails}
            onChangeText={(text) => handleRecentChanges({ dietDetails: text })}
            placeholder={t('symptoms.contextual.dietDetailsPlaceholder')}
            placeholderTextColor={colors.textSecondary}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('symptoms.contextual.environmentalFactors')}
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            value={newFactor}
            onChangeText={setNewFactor}
            placeholder={t('symptoms.contextual.factorPlaceholder')}
            placeholderTextColor={colors.textSecondary}
            onSubmitEditing={handleAddFactor}
          />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={handleAddFactor}
          >
            <Icon name="add" size={24} color={colors.textInverted} />
          </TouchableOpacity>
        </View>

        <View style={styles.chipContainer}>
          {environmentalFactors.map(factor => (
            <View
              key={factor.id}
              style={[styles.chip, { backgroundColor: colors.card }]}
            >
              <Text style={[styles.chipText, { color: colors.text }]}>
                {factor.name}
              </Text>
              <TouchableOpacity
                onPress={() => handleRemoveFactor(factor.id)}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    flex: 1,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginTop: 8,
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
  inputContainer: {
    marginTop: 8,
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginTop: 8,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
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
}); 