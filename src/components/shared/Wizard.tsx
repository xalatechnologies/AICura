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
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { Header } from './Header';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const [buttonScale] = useState(new Animated.Value(1));
  const [headerHeight] = useState(new Animated.Value(1));
  const screenWidth = Dimensions.get('window').width;
  const scrollRef = useRef<ScrollView>(null);
  const lastScrollY = useRef(0);
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const [progressAnim] = useState(new Animated.Value(0));
  const [showHint, setShowHint] = useState(true);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          const { dx, dy } = gestureState;
          return Math.abs(dx) > Math.abs(dy * 1.5);
        },
        onPanResponderMove: (_, gestureState) => {
          const { dx } = gestureState;
          const progress = dx / (screenWidth * 0.8);
          slideAnim.setValue(progress);
          Animated.timing(fadeAnim, {
            toValue: 1 - Math.abs(progress * 0.3),
            duration: 0,
            useNativeDriver: true,
          }).start();
        },
        onPanResponderRelease: (_, gestureState) => {
          const { dx, vx } = gestureState;
          const isSwipeLeft = dx < -screenWidth * 0.15 || vx < -0.3;
          const isSwipeRight = dx > screenWidth * 0.15 || vx > 0.3;

          if (isSwipeLeft && currentStep < steps.length - 1) {
            handleStepChange(currentStep + 1);
          } else if (isSwipeRight && currentStep > 0) {
            handleStepChange(currentStep - 1);
          } else {
            Animated.spring(slideAnim, {
              toValue: 0,
              tension: 50,
              friction: 7,
              useNativeDriver: true,
            }).start();
            Animated.spring(fadeAnim, {
              toValue: 1,
              tension: 50,
              friction: 7,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [currentStep, steps.length]
  );

  const handleScroll = useCallback((event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const delta = scrollY - lastScrollY.current;
    lastScrollY.current = scrollY;

    if (scrollY > 60) {
      Animated.spring(headerHeight, {
        toValue: 0.85,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(headerHeight, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }
  }, []);

  const animateTransition = useCallback((forward: boolean) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: forward ? 1 : -1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.parallel([
        Animated.spring(fadeAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    });
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

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: currentStep / (steps.length - 1),
      tension: 50,
      friction: 7,
      useNativeDriver: false,
    }).start();
  }, [currentStep, steps.length]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header showBack onBack={handleBack} />
      
      <Animated.View style={[styles.progressBar, {
        backgroundColor: colors.border,
        marginTop: insets.top + 8,
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
        contentContainerStyle={[styles.scrollContainer, { paddingBottom: insets.bottom + 100 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Animated.View style={[
          styles.header,
          {
            transform: [{ scale: headerHeight }],
            opacity: headerHeight.interpolate({
              inputRange: [0.85, 1],
              outputRange: [0.8, 1],
            })
          }
        ]}>
          <LinearGradient
            colors={[colors.primary + '20', 'transparent']}
            style={styles.headerGradient}
          >
            <View style={styles.headerRow}>
              <Animated.View style={[styles.iconContainer, {
                backgroundColor: colors.primary + '15',
                transform: [{
                  rotate: slideAnim.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: ['30deg', '0deg', '-30deg'],
                  })
                }]
              }]}>
                <Icon name={steps[currentStep].icon} size={32} color={colors.primary} />
              </Animated.View>
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
        </Animated.View>

        {showHint && (
          <Animated.View style={[styles.hintContainer, {
            opacity: fadeAnim,
            transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            })}]
          }]}>
            <TouchableOpacity 
              style={[styles.hintButton, { backgroundColor: colors.primary + '10' }]}
              onPress={() => setShowHint(false)}
            >
              <Icon name="information-circle" size={20} color={colors.primary} />
              <Text style={[styles.hintText, { color: colors.primary }]}>
                Swipe left/right to navigate between steps
              </Text>
              <Icon name="close-circle" size={16} color={colors.primary} />
            </TouchableOpacity>
          </Animated.View>
        )}

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
                  }),
                },
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0.7, 1],
                    outputRange: [0.95, 1],
                  }),
                },
                {
                  rotate: slideAnim.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: ['5deg', '0deg', '-5deg'],
                  }),
                },
              ],
            },
          ]}
        >
          {steps[currentStep].component}
        </Animated.View>
      </ScrollView>

      <Animated.View style={[
        styles.footer,
        {
          paddingBottom: insets.bottom + 16,
          backgroundColor: colors.background,
          transform: [{
            translateY: headerHeight.interpolate({
              inputRange: [0.85, 1],
              outputRange: [0, 10],
            })
          }]
        }
      ]}>
        <View style={styles.pagination}>
          {steps.map((step, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                animateButtonPress();
                handleStepChange(index);
                scrollRef.current?.scrollTo({ y: 0, animated: true });
              }}
              style={styles.dotButton}
            >
              <Animated.View
                style={[
                  styles.dot,
                  {
                    backgroundColor: index === currentStep ? colors.primary : colors.border,
                    width: index === currentStep ? 24 : 8,
                    transform: [
                      { scale: index === currentStep ? buttonScale : 1 }
                    ],
                  },
                ]}
              />
              {index === currentStep && (
                <Text style={[styles.stepNumber, { color: colors.textSecondary }]}>
                  {index + 1}/{steps.length}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Animated.View
          style={[
            styles.nextButtonContainer,
            {
              transform: [{ scale: buttonScale }],
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
            <LinearGradient
              colors={validateStep() ? [colors.primary, colors.primary + 'DD'] : [colors.border, colors.border]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
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
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
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