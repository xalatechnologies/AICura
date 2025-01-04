import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@theme/ThemeContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@lib/supabase';
import {
  WelcomeStep,
  UserDetailsStep,
  MedicalHistoryStep,
  LifestyleStep,
  ReviewStep,
  UserProfile,
  OnboardingStep,
} from './onboarding';
import { useAuth } from '@context/AuthContext';

type OnboardingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

export const OnboardingScreen = ({ navigation }: OnboardingScreenProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: '',
    gender: '',
    medicalHistory: {
      conditions: [],
      allergies: [],
      medications: []
    },
    lifestyle: {
      smoking: false,
      alcohol: 'none',
      activity: 'moderate'
    }
  });
  const [slideAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(1));
  const [buttonScale] = useState(new Animated.Value(1));
  const { updateProfile } = useAuth();

  const steps: OnboardingStep[] = useMemo(() => [
    {
      key: 'welcome',
      title: t('onboarding.steps.welcome.title'),
      description: t('onboarding.steps.welcome.description'),
      icon: 'heart-outline',
    },
    {
      key: 'userDetails',
      title: t('onboarding.steps.userDetails.title'),
      description: t('onboarding.steps.userDetails.description'),
      icon: 'person-outline',
    },
    {
      key: 'medicalHistory',
      title: t('onboarding.steps.medicalHistory.title'),
      description: t('onboarding.steps.medicalHistory.description'),
      icon: 'medical-outline',
    },
    {
      key: 'lifestyle',
      title: t('onboarding.steps.lifestyle.title'),
      description: t('onboarding.steps.lifestyle.description'),
      icon: 'fitness-outline',
    },
    {
      key: 'review',
      title: t('onboarding.steps.review.title'),
      description: t('onboarding.steps.review.description'),
      icon: 'checkmark-circle-outline',
    },
  ], [t]);

  useEffect(() => {
    loadSavedProgress();
  }, []);

  const loadSavedProgress = async () => {
    try {
      const savedStep = await AsyncStorage.getItem('onboardingStep');
      const savedProfile = await AsyncStorage.getItem('onboardingProfile');
      
      if (savedStep) {
        const step = parseInt(savedStep);
        setCurrentStep(step);
      }
      
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error('Error loading saved progress:', error);
    }
  };

  const saveProgress = useCallback(async () => {
    try {
      await AsyncStorage.setItem('onboardingStep', currentStep.toString());
      await AsyncStorage.setItem('onboardingProfile', JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, [currentStep, profile]);

  const animateTransition = useCallback((forward: boolean) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: forward ? 1 : -1,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const validateStep = useCallback(() => {
    switch (steps[currentStep].key) {
      case 'welcome':
        return true;

      case 'userDetails':
        return !!(profile.name.trim() && profile.age && profile.gender);

      case 'medicalHistory':
        if (profile.medicalHistory.conditions.length > 0) {
          return profile.medicalHistory.medications.length > 0;
        }
        return true;

      case 'lifestyle':
        return !!(profile.lifestyle.activity && profile.lifestyle.alcohol);

      case 'review':
        return true;

      default:
        return true;
    }
  }, [currentStep, profile, steps]);

  const handleStepChange = useCallback((step: number) => {
    if (step < currentStep || validateStep()) {
      animateTransition(step > currentStep);
      setCurrentStep(step);
      saveProgress();
    }
  }, [currentStep, validateStep, animateTransition, saveProgress]);

  const animateButtonPress = useCallback(() => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [buttonScale]);

  const mapActivityToExerciseFrequency = (activity: string): 'none' | 'occasional' | 'regular' | 'frequent' => {
    const map: { [key: string]: 'none' | 'occasional' | 'regular' | 'frequent' } = {
      'sedentary': 'none',
      'moderate': 'regular',
      'active': 'frequent',
      'light': 'occasional'
    };
    return map[activity] || 'none';
  };

  const handleNext = useCallback(async () => {
    animateButtonPress();

    if (currentStep < steps.length - 1) {
      handleStepChange(currentStep + 1);
    } else {
      try {
        setLoading(true);
        
        const profileData = {
          name: profile.name,
          age: parseInt(profile.age),
          gender: profile.gender,
          preferred_language: 'en',
          lifestyle_factors: {
            smoking: profile.lifestyle.smoking,
            alcohol: profile.lifestyle.alcohol !== 'none',
            exercise_frequency: mapActivityToExerciseFrequency(profile.lifestyle.activity),
            diet_restrictions: []
          },
          medical_conditions: profile.medicalHistory.conditions,
          allergies: profile.medicalHistory.allergies,
          medications: profile.medicalHistory.medications.map(med => med.name),
          onboarding_completed: true
        };

        await updateProfile(profileData);
        
        await AsyncStorage.setItem('onboardingComplete', 'true');
        navigation.navigate('MainTabs');
      } catch (error) {
        Alert.alert('Error', 'Failed to save profile');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [currentStep, steps.length, handleStepChange, animateButtonPress, profile, navigation, updateProfile]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      handleStepChange(currentStep - 1);
    }
  }, [currentStep, handleStepChange]);

  const handleProfileUpdate = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const renderStepContent = useCallback(() => {
    switch (steps[currentStep].key) {
      case 'welcome':
        return <WelcomeStep />;

      case 'userDetails':
        return (
          <UserDetailsStep
            profile={profile}
            onUpdateProfile={handleProfileUpdate}
          />
        );

      case 'medicalHistory':
        return (
          <MedicalHistoryStep
            profile={profile}
            onUpdateProfile={handleProfileUpdate}
          />
        );

      case 'lifestyle':
        return (
          <LifestyleStep
            profile={profile}
            onUpdateProfile={handleProfileUpdate}
          />
        );

      case 'review':
        return (
          <ReviewStep
            profile={profile}
            onEditSection={handleStepChange}
          />
        );

      default:
        return null;
    }
  }, [steps, currentStep, profile, handleProfileUpdate, handleStepChange]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 60 : 40 }]}>
        {currentStep > 0 && (
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.card }]}
            onPress={handleBack}
          >
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
        <Icon name={steps[currentStep].icon} size={60} color={colors.primary} />
        <Text style={[styles.stepTitle, { color: colors.text }]}>
          {steps[currentStep].title}
        </Text>
        <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
          {steps[currentStep].description}
        </Text>
      </View>

      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{
              translateX: slideAnim.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [-300, 0, 300],
              }),
            }],
          },
        ]}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {renderStepContent()}
        </ScrollView>
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {steps.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                animateButtonPress();
                handleStepChange(index);
              }}
              style={styles.dotButton}
            >
              <Animated.View
                style={[
                  styles.dot,
                  {
                    backgroundColor: index === currentStep ? colors.primary : colors.border,
                    width: index === currentStep ? 20 : 10,
                    transform: [
                      { scale: index === currentStep ? buttonScale : 1 }
                    ],
                  },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
        <Animated.View
          style={[
            styles.nextButtonContainer,
            {
              transform: [
                { scale: buttonScale },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.nextButton,
              { 
                backgroundColor: validateStep() ? colors.primary : colors.border,
                opacity: loading ? 0.7 : 1,
              },
            ]}
            onPress={handleNext}
            disabled={loading || !validateStep()}
          >
            <Text style={styles.buttonText}>
              {currentStep === steps.length - 1 
                ? t('onboarding.navigation.finish')
                : t('onboarding.navigation.next')
              }
            </Text>
            <Icon
              name={currentStep === steps.length - 1 ? 'checkmark' : 'arrow-forward'}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  stepDescription: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotButton: {
    padding: 10,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  nextButtonContainer: {
    overflow: 'hidden',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    justifyContent: 'center',
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
}); 