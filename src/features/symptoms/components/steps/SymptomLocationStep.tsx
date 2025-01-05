import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BodyMap, BodyPart } from '../BodyMap';

const BODY_PARTS: BodyPart[] = [
  {
    id: 'head',
    name: 'symptoms.bodyMap.bodyParts.head',
    commonSymptoms: ['symptoms.commonSymptoms.headache', 'symptoms.commonSymptoms.dizziness', 'symptoms.commonSymptoms.migraine']
  },
  {
    id: 'neck',
    name: 'symptoms.bodyMap.bodyParts.neck',
    commonSymptoms: ['symptoms.commonSymptoms.neckPain', 'symptoms.commonSymptoms.stiffness', 'symptoms.commonSymptoms.swollenLymphNodes']
  },
  {
    id: 'chest',
    name: 'symptoms.bodyMap.bodyParts.chest',
    commonSymptoms: ['symptoms.commonSymptoms.chestPain', 'symptoms.commonSymptoms.shortnessOfBreath', 'symptoms.commonSymptoms.heartPalpitations']
  },
  {
    id: 'abdomen',
    name: 'symptoms.bodyMap.bodyParts.abdomen',
    commonSymptoms: ['symptoms.commonSymptoms.stomachPain', 'symptoms.commonSymptoms.nausea', 'symptoms.commonSymptoms.bloating']
  },
  {
    id: 'left-upper-arm',
    name: 'symptoms.bodyMap.bodyParts.leftUpperArm',
    commonSymptoms: ['symptoms.commonSymptoms.pain', 'symptoms.commonSymptoms.weakness', 'symptoms.commonSymptoms.numbness']
  },
  {
    id: 'right-upper-arm',
    name: 'symptoms.bodyMap.bodyParts.rightUpperArm',
    commonSymptoms: ['symptoms.commonSymptoms.pain', 'symptoms.commonSymptoms.weakness', 'symptoms.commonSymptoms.numbness']
  },
  {
    id: 'left-lower-arm',
    name: 'symptoms.bodyMap.bodyParts.leftLowerArm',
    commonSymptoms: ['symptoms.commonSymptoms.pain', 'symptoms.commonSymptoms.weakness', 'symptoms.commonSymptoms.numbness']
  }
];

interface SymptomLocationStepProps {
  onDataChange?: (data: any) => void;
}

export const SymptomLocationStep: React.FC<SymptomLocationStepProps> = ({
  onDataChange,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null);

  const handlePartSelect = (partId: string) => {
    const part = BODY_PARTS.find(p => p.id === partId);
    if (part) {
      setSelectedPart(part);
      onDataChange?.({
        location: {
          id: part.id,
          name: t(part.name),
          commonSymptoms: part.commonSymptoms.map((symptom: string) => t(symptom))
        }
      });
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    description: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 24,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('symptoms.steps.location.title')}</Text>
      <Text style={styles.description}>{t('symptoms.steps.location.description')}</Text>
      <BodyMap onPartSelect={handlePartSelect} selectedPart={selectedPart} />
    </View>
  );
};

export default SymptomLocationStep;