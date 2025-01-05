import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BodyMap } from '../BodyMap';

const BODY_PARTS = [
  {
    id: 'head',
    name: 'Head',
    commonSymptoms: ['Headache', 'Dizziness', 'Migraine']
  },
  {
    id: 'neck',
    name: 'Neck',
    commonSymptoms: ['Neck pain', 'Stiffness', 'Swollen lymph nodes']
  },
  {
    id: 'chest',
    name: 'Chest',
    commonSymptoms: ['Chest pain', 'Shortness of breath', 'Heart palpitations']
  },
  {
    id: 'abdomen',
    name: 'Abdomen',
    commonSymptoms: ['Stomach pain', 'Nausea', 'Bloating']
  },
  {
    id: 'left-upper-arm',
    name: 'Left Upper Arm',
    commonSymptoms: ['Pain', 'Weakness', 'Numbness']
  },
  {
    id: 'right-upper-arm',
    name: 'Right Upper Arm',
    commonSymptoms: ['Pain', 'Weakness', 'Numbness']
  },
  {
    id: 'left-lower-arm',
    name: 'Left Lower Arm',
    commonSymptoms: ['Pain', 'Weakness', 'Numbness']
  },
  {
    id: 'right-lower-arm',
    name: 'Right Lower Arm',
    commonSymptoms: ['Pain', 'Weakness', 'Numbness']
  },
  {
    id: 'left-upper-leg',
    name: 'Left Thigh',
    commonSymptoms: ['Pain', 'Weakness', 'Numbness']
  },
  {
    id: 'right-upper-leg',
    name: 'Right Thigh',
    commonSymptoms: ['Pain', 'Weakness', 'Numbness']
  },
  {
    id: 'left-lower-leg',
    name: 'Left Lower Leg',
    commonSymptoms: ['Pain', 'Weakness', 'Numbness']
  },
  {
    id: 'right-lower-leg',
    name: 'Right Lower Leg',
    commonSymptoms: ['Pain', 'Weakness', 'Numbness']
  },
  // Back parts
  {
    id: 'head-back',
    name: 'Back of Head',
    commonSymptoms: ['Headache', 'Tension', 'Stiffness']
  },
  {
    id: 'neck-back',
    name: 'Back of Neck',
    commonSymptoms: ['Neck pain', 'Stiffness', 'Muscle tension']
  },
  {
    id: 'upper-back',
    name: 'Upper Back',
    commonSymptoms: ['Back pain', 'Muscle tension', 'Stiffness']
  },
  {
    id: 'lower-back',
    name: 'Lower Back',
    commonSymptoms: ['Lower back pain', 'Sciatica', 'Muscle strain']
  },
  {
    id: 'left-buttock',
    name: 'Left Buttock',
    commonSymptoms: ['Pain', 'Sciatica', 'Muscle strain']
  },
  {
    id: 'right-buttock',
    name: 'Right Buttock',
    commonSymptoms: ['Pain', 'Sciatica', 'Muscle strain']
  }
];

export const SymptomLocationStep: React.FC = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [selectedBodyPart, setSelectedBodyPart] = useState<(typeof BODY_PARTS)[0] | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.bodyMapContainer}>
        <BodyMap
          bodyParts={BODY_PARTS}
          selectedPart={selectedBodyPart}
          onSelectPart={setSelectedBodyPart}
        />
        {selectedBodyPart && (
          <Text style={[styles.selectedPartText, { color: colors.text }]}>
            {selectedBodyPart.name}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  bodyMapContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedPartText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default SymptomLocationStep;