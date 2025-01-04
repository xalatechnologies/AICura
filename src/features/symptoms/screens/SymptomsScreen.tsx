import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Header } from '@/components/shared/Header';
import { Wizard, WizardStep } from '@/components/shared/Wizard';
import {
  SymptomLocationStep,
  SymptomDetailsStep,
  MedicalHistoryStep,
  ContextualFactorsStep,
  ComplicationsStep,
  SummaryStep,
} from '../components/steps';

export const SymptomsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [wizardData, setWizardData] = useState({});

  const handleStepChange = useCallback((step: number) => {
    // Handle step change if needed
  }, []);

  const handleComplete = useCallback((data: any) => {
    // Handle wizard completion
    console.log('Wizard completed with data:', data);
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const steps: WizardStep[] = [
    {
      key: 'location',
      title: t('symptoms.steps.location.title'),
      description: t('symptoms.steps.location.description'),
      icon: 'body-outline',
      component: <SymptomLocationStep />,
      validate: () => true, // Add proper validation
    },
    {
      key: 'details',
      title: t('symptoms.steps.details.title'),
      description: t('symptoms.steps.details.description'),
      icon: 'list-outline',
      component: <SymptomDetailsStep />,
      validate: () => true,
    },
    {
      key: 'history',
      title: t('symptoms.steps.history.title'),
      description: t('symptoms.steps.history.description'),
      icon: 'medical-outline',
      component: <MedicalHistoryStep />,
      validate: () => true,
    },
    {
      key: 'context',
      title: t('symptoms.steps.context.title'),
      description: t('symptoms.steps.context.description'),
      icon: 'information-circle-outline',
      component: <ContextualFactorsStep />,
      validate: () => true,
    },
    {
      key: 'complications',
      title: t('symptoms.steps.complications.title'),
      description: t('symptoms.steps.complications.description'),
      icon: 'warning-outline',
      component: <ComplicationsStep />,
      validate: () => true,
    },
    {
      key: 'summary',
      title: t('symptoms.steps.summary.title'),
      description: t('symptoms.steps.summary.description'),
      icon: 'checkmark-circle-outline',
      component: <SummaryStep data={wizardData} />,
      validate: () => true,
    },
  ];

  return (
    <View style={styles.container}>
      <Wizard
        steps={steps}
        onComplete={handleComplete}
        onStepChange={handleStepChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 