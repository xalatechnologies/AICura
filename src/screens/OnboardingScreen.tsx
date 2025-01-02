import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

interface OnboardingStep {
  key: string;
  title: string;
  description: string;
  icon: string;
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
      icon: 'medkit-outline',
    },
    {
      key: '2',
      title: t('onboarding.steps.2.title'),
      description: t('onboarding.steps.2.description'),
      icon: 'calendar-outline',
    },
    {
      key: '3',
      title: t('onboarding.steps.3.title'),
      description: t('onboarding.steps.3.description'),
      icon: 'chatbubbles-outline',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.replace('MainTabs');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Icon name={steps[currentStep].icon} size={100} color={colors.primary} />
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
                styles.dot,
                {
                  backgroundColor: index === currentStep ? colors.primary : colors.border,
                  width: index === currentStep ? 20 : 10,
                },
              ]}
            />
          ))}
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 