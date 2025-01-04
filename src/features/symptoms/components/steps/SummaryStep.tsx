import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

interface SummaryStepProps {
  data: {
    symptoms?: any[];
    symptomDetails?: any;
    medicalHistory?: {
      conditions: any[];
      allergies: any[];
      medications: any[];
    };
    contextualFactors?: {
      lifestyle: {
        smoking: boolean;
        alcohol: string;
        occupation: string;
      };
      recentChanges: {
        travel: boolean;
        travelDetails?: string;
        dietChange: boolean;
        dietDetails?: string;
      };
      environmentalFactors: any[];
    };
    complications?: any[];
    additionalSymptoms?: any[];
  };
  onEdit?: (step: number) => void;
}

export const SummaryStep: React.FC<SummaryStepProps> = ({
  data,
  onEdit,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const renderSection = (title: string, content: React.ReactNode, stepIndex: number) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {title}
        </Text>
        {onEdit && (
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.card }]}
            onPress={() => onEdit(stepIndex)}
          >
            <Icon name="pencil" size={16} color={colors.primary} />
            <Text style={[styles.editText, { color: colors.primary }]}>
              {t('common.edit')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {content}
    </View>
  );

  const renderSymptoms = () => (
    <View style={styles.content}>
      {data.symptoms?.map((symptom, index) => (
        <View
          key={symptom.id || index}
          style={[styles.item, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.itemTitle, { color: colors.text }]}>
            {symptom.name}
          </Text>
          {symptom.bodyPart && (
            <Text style={[styles.itemDetail, { color: colors.textSecondary }]}>
              {t('symptoms.location')}: {symptom.bodyPart}
            </Text>
          )}
          {data.symptomDetails?.[symptom.id] && (
            <>
              <Text style={[styles.itemDetail, { color: colors.textSecondary }]}>
                {t('symptoms.onset')}: {t(`symptoms.onset.${data.symptomDetails[symptom.id].onset}`)}
              </Text>
              <Text style={[styles.itemDetail, { color: colors.textSecondary }]}>
                {t('symptoms.severity')}: {data.symptomDetails[symptom.id].severity}/10
              </Text>
            </>
          )}
        </View>
      ))}
    </View>
  );

  const renderMedicalHistory = () => (
    <View style={styles.content}>
      {data.medicalHistory?.conditions && data.medicalHistory.conditions.length > 0 && (
        <View style={styles.subSection}>
          <Text style={[styles.subTitle, { color: colors.text }]}>
            {t('symptoms.medicalHistory.conditions')}
          </Text>
          <View style={styles.chipContainer}>
            {data.medicalHistory.conditions.map((condition, index) => (
              <View
                key={condition.id || index}
                style={[styles.chip, { backgroundColor: colors.card }]}
              >
                <Text style={[styles.chipText, { color: colors.text }]}>
                  {condition.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {data.medicalHistory?.allergies && data.medicalHistory.allergies.length > 0 && (
        <View style={styles.subSection}>
          <Text style={[styles.subTitle, { color: colors.text }]}>
            {t('symptoms.medicalHistory.allergies')}
          </Text>
          <View style={styles.chipContainer}>
            {data.medicalHistory?.allergies.map((allergy, index) => (
              <View
                key={allergy.id || index}
                style={[styles.chip, { backgroundColor: colors.card }]}
              >
                <Text style={[styles.chipText, { color: colors.text }]}>
                  {allergy.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {data.medicalHistory?.medications && data.medicalHistory.medications.length > 0 && (
        <View style={styles.subSection}>
          <Text style={[styles.subTitle, { color: colors.text }]}>
            {t('symptoms.medicalHistory.medications')}
          </Text>
          <View style={styles.chipContainer}>
            {data.medicalHistory?.medications.map((medication, index) => (
              <View
                key={medication.id || index}
                style={[styles.chip, { backgroundColor: colors.card }]}
              >
                <Text style={[styles.chipText, { color: colors.text }]}>
                  {medication.name}
                  {medication.dosage && ` (${medication.dosage})`}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderContextualFactors = () => (
    <View style={styles.content}>
      {data.contextualFactors?.lifestyle && (
        <View style={styles.subSection}>
          <Text style={[styles.subTitle, { color: colors.text }]}>
            {t('symptoms.contextual.lifestyle')}
          </Text>
          <View style={[styles.item, { backgroundColor: colors.card }]}>
            <Text style={[styles.itemDetail, { color: colors.textSecondary }]}>
              {t('symptoms.contextual.smoking')}: {data.contextualFactors.lifestyle.smoking ? t('common.yes') : t('common.no')}
            </Text>
            <Text style={[styles.itemDetail, { color: colors.textSecondary }]}>
              {t('symptoms.contextual.alcohol')}: {t(`symptoms.contextual.alcoholOptions.${data.contextualFactors.lifestyle.alcohol}`)}
            </Text>
            {data.contextualFactors.lifestyle.occupation && (
              <Text style={[styles.itemDetail, { color: colors.textSecondary }]}>
                {t('symptoms.contextual.occupation')}: {data.contextualFactors.lifestyle.occupation}
              </Text>
            )}
          </View>
        </View>
      )}

      {data.contextualFactors?.recentChanges && (
        <View style={styles.subSection}>
          <Text style={[styles.subTitle, { color: colors.text }]}>
            {t('symptoms.contextual.recentChanges')}
          </Text>
          <View style={[styles.item, { backgroundColor: colors.card }]}>
            {data.contextualFactors.recentChanges.travel && (
              <Text style={[styles.itemDetail, { color: colors.textSecondary }]}>
                {t('symptoms.contextual.travel')}: {data.contextualFactors.recentChanges.travelDetails}
              </Text>
            )}
            {data.contextualFactors.recentChanges.dietChange && (
              <Text style={[styles.itemDetail, { color: colors.textSecondary }]}>
                {t('symptoms.contextual.dietChange')}: {data.contextualFactors.recentChanges.dietDetails}
              </Text>
            )}
          </View>
        </View>
      )}

      {data.contextualFactors?.environmentalFactors && data.contextualFactors.environmentalFactors.length > 0 && (
        <View style={styles.subSection}>
          <Text style={[styles.subTitle, { color: colors.text }]}>
            {t('symptoms.contextual.environmentalFactors')}
          </Text>
          <View style={styles.chipContainer}>
            {data.contextualFactors?.environmentalFactors.map((factor, index) => (
              <View
                key={factor.id || index}
                style={[styles.chip, { backgroundColor: colors.card }]}
              >
                <Text style={[styles.chipText, { color: colors.text }]}>
                  {factor.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderComplications = () => (
    <View style={styles.content}>
      {data.complications && data.complications.length > 0 && (
        <View style={styles.subSection}>
          <Text style={[styles.subTitle, { color: colors.text }]}>
            {t('symptoms.complications.title')}
          </Text>
          {data.complications?.map((complication, index) => (
            <View
              key={complication.id || index}
              style={[styles.item, { backgroundColor: colors.card }]}
            >
              <Text style={[styles.itemTitle, { color: colors.text }]}>
                {complication.name}
              </Text>
              <Text style={[styles.itemDetail, { color: colors.textSecondary }]}>
                {t('symptoms.severity')}: {t(`symptoms.severity.${complication.severity}`)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {data.additionalSymptoms && data.additionalSymptoms.length > 0 && (
        <View style={styles.subSection}>
          <Text style={[styles.subTitle, { color: colors.text }]}>
            {t('symptoms.additionalSymptoms.title')}
          </Text>
          {data.additionalSymptoms?.map((symptom, index) => (
            <View
              key={symptom.id || index}
              style={[styles.item, { backgroundColor: colors.card }]}
            >
              <Text style={[styles.itemTitle, { color: colors.text }]}>
                {symptom.name}
              </Text>
              {symptom.description && (
                <Text style={[styles.itemDetail, { color: colors.textSecondary }]}>
                  {symptom.description}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderSection(t('symptoms.steps.location.title'), renderSymptoms(), 0)}
      {renderSection(t('symptoms.steps.history.title'), renderMedicalHistory(), 2)}
      {renderSection(t('symptoms.steps.context.title'), renderContextualFactors(), 3)}
      {renderSection(t('symptoms.steps.complications.title'), renderComplications(), 4)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  editText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  content: {
    marginTop: 8,
  },
  subSection: {
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  item: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemDetail: {
    fontSize: 14,
    marginTop: 2,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
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
}); 