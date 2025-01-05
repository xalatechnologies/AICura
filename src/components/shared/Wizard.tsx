import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { Header } from './Header';
import { useNavigation } from '@react-navigation/native';

export interface WizardStep {
  key: string;
  title: string;
  description: string;
  icon: string;
  component: React.ReactNode;
  validate?: () => boolean;
}

interface WizardProps {
  steps: WizardStep[];
  onComplete: (data: any) => void;
  onStepChange?: (step: number) => void;
  initialStep?: number;
  loading?: boolean;
}

export const Wizard: React.FC<WizardProps> = ({
  steps,
  onComplete,
  onStepChange,
  initialStep = 0,
  loading = false,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [slideAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(1));
  const [buttonScale] = useState(new Animated.Value(1));
  const screenWidth = Dimensions.get('window').width;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          const { dx, dy } = gestureState;
          return Math.abs(dx) > Math.abs(dy * 2);
        },
        onPanResponderMove: (_, gestureState) => {
          const { dx } = gestureState;
          slideAnim.setValue(dx / screenWidth);
        },
        onPanResponderRelease: (_, gestureState) => {
          const { dx, vx } = gestureState;
          const isSwipeLeft = dx < -screenWidth * 0.2 || vx < -0.5;
          const isSwipeRight = dx > screenWidth * 0.2 || vx > 0.5;

          if (isSwipeLeft && currentStep < steps.length - 1) {
            handleStepChange(currentStep + 1);
          } else if (isSwipeRight && currentStep > 0) {
            handleStepChange(currentStep - 1);
          } else {
            // Reset position if swipe wasn't far enough
            Animated.spring(slideAnim, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [currentStep, steps.length]
  );

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
    const currentStepData = steps[currentStep];
    return currentStepData.validate ? currentStepData.validate() : true;
  }, [currentStep, steps]);

  const handleStepChange = useCallback((step: number) => {
    if (step < currentStep || validateStep()) {
      animateTransition(step > currentStep);
      setCurrentStep(step);
      onStepChange?.(step);
    }
  }, [currentStep, validateStep, animateTransition, onStepChange]);

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

  const handleNext = useCallback(() => {
    animateButtonPress();

    if (currentStep < steps.length - 1) {
      handleStepChange(currentStep + 1);
    } else {
      onComplete(steps.map(step => step.key));
    }
  }, [currentStep, steps.length, handleStepChange, animateButtonPress, onComplete]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      handleStepChange(currentStep - 1);
    } else {
      navigation.goBack();
    }
  }, [currentStep, handleStepChange]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header showBack onBack={handleBack} />
      
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 20 : 10 }]}>
        <Icon name={steps[currentStep].icon} size={60} color={colors.primary} />
        <Text style={[styles.stepTitle, { color: colors.text }]}>
          {steps[currentStep].title}
        </Text>
        <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
          {steps[currentStep].description}
        </Text>
      </View>

      <Animated.View 
        {...panResponder.panHandlers}
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
          {steps[currentStep].component}
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
                ? t('common.finish')
                : t('common.next')
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
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dotButton: {
    padding: 8,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  nextButtonContainer: {
    alignItems: 'stretch',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
}); 