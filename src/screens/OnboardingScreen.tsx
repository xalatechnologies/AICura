import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

interface OnboardingStep {
  key: string;
  title: string;
  description: string;
  image: any;
}

export const OnboardingScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);

  const steps: OnboardingStep[] = [
    {
      key: '1',
      title: t('onboarding.steps.1.title'),
      description: t('onboarding.steps.1.description'),
      image: require('../assets/onboarding/health-assistant.png'),
    },
    {
      key: '2',
      title: t('onboarding.steps.2.title'),
      description: t('onboarding.steps.2.description'),
      image: require('../assets/onboarding/symptom-analysis.png'),
    },
    {
      key: '3',
      title: t('onboarding.steps.3.title'),
      description: t('onboarding.steps.3.description'),
      image: require('../assets/onboarding/medical-history.png'),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.replace('MainTabs');
    }
  };

  const handleSkip = () => {
    navigation.replace('MainTabs');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={styles.skipButton}
        onPress={handleSkip}
      >
        <Text style={[styles.skipText, { color: colors.primary }]}>
          {t('common.skip')}
        </Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Image
          source={steps[currentStep].image}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={[styles.title, { color: colors.text }]}>
          {steps[currentStep].title}
        </Text>

        <Text style={[styles.description, { color: colors.text }]}>
          {steps[currentStep].description}
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor: index === currentStep ? colors.primary : colors.border,
                  width: index === currentStep ? 20 : 10,
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: colors.primary }]}
          onPress={handleNext}
        >
          <Icon
            name={currentStep === steps.length - 1 ? 'checkmark' : 'arrow-forward'}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationDot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  nextButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4FD1C5',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
}); 