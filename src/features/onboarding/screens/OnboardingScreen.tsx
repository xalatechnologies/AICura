import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Wizard, WizardStep } from '@/components/shared/Wizard';
import {
  WelcomeStep,
  UserDetailsStep,
  MedicalHistoryStep,
  LifestyleStep,
  ReviewStep,
} from '../components/steps';

export const OnboardingScreen = () => {
  const { t } = useTranslation();
  const [wizardData, setWizardData] = useState({});

  const handleStepChange = useCallback((step: number) => {
    // Handle step change if needed
  }, []);

  const handleComplete = useCallback((data: any) => {
    // Handle wizard completion
    console.log('Onboarding completed with data:', data);
  }, []);

  const steps: WizardStep[] = [
    {
      key: 'welcome',
      title: t('onboarding.steps.welcome.title'),
      description: t('onboarding.steps.welcome.description'),
      icon: 'heart-outline',
      component: <WelcomeStep />,
      validate: () => true,
    },
    {
      key: 'userDetails',
      title: t('onboarding.steps.userDetails.title'),
      description: t('onboarding.steps.userDetails.description'),
      icon: 'person-outline',
      component: <UserDetailsStep />,
      validate: () => true,
    },
    {
      key: 'medicalHistory',
      title: t('onboarding.steps.medicalHistory.title'),
      description: t('onboarding.steps.medicalHistory.description'),
      icon: 'medical-outline',
      component: <MedicalHistoryStep />,
      validate: () => true,
    },
    {
      key: 'lifestyle',
      title: t('onboarding.steps.lifestyle.title'),
      description: t('onboarding.steps.lifestyle.description'),
      icon: 'bicycle-outline',
      component: <LifestyleStep />,
      validate: () => true,
    },
    {
      key: 'review',
      title: t('onboarding.steps.review.title'),
      description: t('onboarding.steps.review.description'),
      icon: 'checkmark-circle-outline',
      component: <ReviewStep data={wizardData} />,
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