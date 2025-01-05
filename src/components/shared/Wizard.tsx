import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
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
  AccessibilityInfo,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { Header } from './Header';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useWindowDimensions } from 'react-native';

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
  const [progressAnim] = useState(new Animated.Value(0));
  const [showHint, setShowHint] = useState(true);
  const screenWidth = Dimensions.get('window').width;
  const scrollRef = useRef<ScrollView>(null);
  const { width: windowWidth } = useWindowDimensions();

  const validateStep = useCallback(() => {
    const currentStepData = steps[currentStep];
    return currentStepData.validate ? currentStepData.validate() : true;
  }, [currentStep, steps]);

  const animateTransition = useCallback((forward: boolean) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: forward ? -50 : 50,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      slideAnim.setValue(forward ? 50 : -50);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [fadeAnim, slideAnim]);

  const handleStepChange = useCallback((step: number) => {
    if (step < currentStep || validateStep()) {
      animateTransition(step > currentStep);
      setCurrentStep(step);
      onStepChange?.(step);
    }
  }, [currentStep, validateStep, animateTransition, onStepChange]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      handleStepChange(currentStep + 1);
    } else {
      onComplete(steps.map(step => step.key));
    }
  }, [currentStep, steps.length, handleStepChange, onComplete]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      handleStepChange(currentStep - 1);
    } else {
      navigation.goBack();
    }
  }, [currentStep, handleStepChange, navigation]);

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
            Animated.spring(slideAnim, {
              toValue: 0,
              tension: 50,
              friction: 8,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [currentStep, steps.length, handleStepChange]
  );

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentStep / (steps.length - 1),
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep, steps.length]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header 
        showBack 
        onBack={handleBack} 
        accessibilityLabel={t('common.accessibility.previousStep')}
      />
      
      <Animated.View style={[styles.progressBar, {
        backgroundColor: colors.border,
        marginTop: Platform.OS === 'ios' ? 48 : 16,
      }]}>
        <Animated.View style={[styles.progressFill, {
          backgroundColor: colors.primary,
          width: progressAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }),
        }]} />
      </Animated.View>

      <ScrollView 
        ref={scrollRef}
        contentContainerStyle={[styles.scrollContainer, { paddingBottom: Platform.OS === 'ios' ? 100 : 80 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        accessible={true}
        accessibilityRole="adjustable"
        accessibilityLabel={t('common.accessibility.goToStep', { number: currentStep + 1 })}
      >
        <View style={styles.header}>
          <LinearGradient
            colors={[colors.primary + '20', 'transparent']}
            style={styles.headerGradient}
          >
            <View style={styles.headerRow}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                <Icon name={steps[currentStep].icon} size={32} color={colors.primary} />
              </View>
              <View style={styles.headerText}>
                <Text style={[styles.stepTitle, { color: colors.text }]}>
                  {steps[currentStep].title}
                </Text>
                <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
                  {steps[currentStep].description}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <Animated.View 
          {...panResponder.panHandlers}
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateX: slideAnim.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [-windowWidth * 0.8, 0, windowWidth * 0.8],
                  })
                }
              ],
            },
          ]}
        >
          {steps[currentStep].component}
        </Animated.View>
      </ScrollView>

      <View style={[styles.footer, { 
        paddingBottom: Platform.OS === 'ios' ? 34 : 16, 
        backgroundColor: colors.background 
      }]}>
        <View style={styles.pagination}>
          {steps.map((step, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleStepChange(index)}
              style={styles.dotButton}
              accessible={true}
              accessibilityLabel={t('common.accessibility.goToStep', { number: index + 1 })}
            >
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: index === currentStep ? colors.primary : colors.border,
                    width: index === currentStep ? 24 : 8,
                  },
                ]}
              />
              {index === currentStep && (
                <Text style={[styles.stepNumber, { color: colors.textSecondary }]}>
                  {t('common.navigation.stepCount', { current: index + 1, total: steps.length })}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.nextButtonContainer}>
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
            accessible={true}
            accessibilityLabel={currentStep === steps.length - 1 
              ? t('common.navigation.finish')
              : t('common.accessibility.nextStep')}
          >
            <LinearGradient
              colors={validateStep() ? [colors.primary, colors.primary + 'DD'] : [colors.border, colors.border]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {currentStep === steps.length - 1
                  ? t('common.navigation.finish')
                  : t('common.navigation.next')
                }
              </Text>
              <Icon
                name={currentStep === steps.length - 1 ? 'checkmark' : 'arrow-forward'}
                size={24}
                color="#fff"
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginHorizontal: 24,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    marginTop: 16,
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 12,
  },
  headerText: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 15,
    opacity: 0.8,
    lineHeight: 20,
  },
  hintContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  hintText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 4,
  },
  dotButton: {
    padding: 8,
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  stepNumber: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  nextButtonContainer: {
    alignItems: 'center',
  },
  nextButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
}); 