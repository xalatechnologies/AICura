import React, { useState, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolate,
  Extrapolate,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../styles/theme';
import { Moon, MessageCircle, Calendar, Activity, Send, Phone, RotateCcw } from 'react-native-feather';
import { useSymptomAnalysis } from '../hooks/useSymptomAnalysis';
import { debounce } from 'lodash';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle } from 'react-native-svg';
import Markdown from 'react-native-markdown-display';
import { Message, FollowUpRound, FollowUpAnswer } from '../hooks/useSymptomAnalysis';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RootStackParamList } from '../navigation/RootNavigator';

type HomeScreenNavigationProp = BottomTabNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const TypingIndicator = () => {
  const { theme } = useTheme();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;
  const dots = [useSharedValue(0), useSharedValue(0), useSharedValue(0)];

  React.useEffect(() => {
    dots.forEach((dot, index) => {
      dot.value = withRepeat(
        withSequence(
          withDelay(
            index * 200,
            withTiming(1, { duration: 400 })
          ),
          withDelay(
            600,
            withTiming(0, { duration: 400 })
          )
        ),
        -1
      );
    });
  }, []);

  const dotStyles = dots.map(dot => 
    useAnimatedStyle(() => ({
      opacity: interpolate(dot.value, [0, 1], [0.3, 1]),
      transform: [
        { scale: interpolate(dot.value, [0, 1], [0.8, 1.2]) },
        { translateY: interpolate(dot.value, [0, 1], [0, -4]) }
      ],
    }))
  );

  return (
    <View style={[styles.messageBubble, styles.aiMessage, { backgroundColor: currentTheme.colors.card }]}>
      <View style={styles.typingContainer}>
        <View style={styles.roleContainer}>
          <Activity
            stroke={currentTheme.colors.primary}
            width={14}
            height={14}
            style={[styles.roleIcon, { transform: [{ rotate: '45deg' }] }]}
          />
          <Text style={[styles.messageRole, { color: currentTheme.colors.primary }]}>
            AI Assistant is typing
          </Text>
        </View>
        <View style={styles.dotsContainer}>
          {dotStyles.map((style, index) => (
            <Animated.View
              key={index}
              style={[styles.dot, { backgroundColor: currentTheme.colors.primary }, style]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const MessageItem = React.memo(({ 
  item, 
  currentTheme,
  onFollowUpSelect
}: { 
  item: { 
    id: string; 
    role: string; 
    content: string; 
    timestamp?: number;
    followUpOptions?: string[];
  }, 
  currentTheme: any;
  onFollowUpSelect?: (response: string, context: string) => void;
}) => {
  const animatedOpacity = useSharedValue(0);
  const animatedScale = useSharedValue(0.9);
  const animatedTranslateY = useSharedValue(50);
  const pulseAnim = useSharedValue(0);

  React.useEffect(() => {
    animatedOpacity.value = withTiming(1, { duration: 500 });
    animatedScale.value = withSpring(1, { damping: 12 });
    animatedTranslateY.value = withSpring(0, { damping: 12 });

    if (item.role === 'assistant') {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0, { duration: 1000 })
        ),
        -1,
        true
      );
    }
  }, []);

  const messageStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
      transform: [
        { scale: animatedScale.value },
        { translateY: animatedTranslateY.value }
      ],
    };
  });

  const pulseStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(pulseAnim.value, [0, 1], [0.5, 0.8]),
      transform: [
        { scale: interpolate(pulseAnim.value, [0, 1], [1, 1.02]) }
      ],
    };
  });

  const formattedTime = item.timestamp 
    ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  const isAI = item.role === 'assistant';

  return (
    <Animated.View style={[
      styles.messageBubble,
      isAI ? null : styles.userMessage,
      { 
        backgroundColor: isAI 
          ? currentTheme.colors.card
          : currentTheme.colors.primary,
        borderColor: isAI ? currentTheme.colors.border : 'transparent',
        borderWidth: isAI ? 1 : 0,
      },
      messageStyle,
    ]}>
      <LinearGradient
        colors={isAI 
          ? [currentTheme.colors.card, currentTheme.colors.card]
          : [currentTheme.colors.primary, `${currentTheme.colors.primary}CC`]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.messageGradient, isAI && pulseStyle]}
      />
      <View style={styles.messageHeader}>
        <View style={styles.roleContainer}>
          {isAI && (
            <Activity
              stroke={currentTheme.colors.primary}
              width={14}
              height={14}
              style={[styles.roleIcon, { transform: [{ rotate: '45deg' }] }]}
            />
          )}
          <Text style={[
            styles.messageRole,
            { color: isAI ? currentTheme.colors.primary : '#FFFFFF' }
          ]}>
            {isAI ? 'AI Assistant' : 'You'}
          </Text>
        </View>
        {formattedTime && (
          <Text style={[
            styles.messageTime,
            { color: isAI ? `${currentTheme.colors.text}80` : '#FFFFFF80' }
          ]}>
            {formattedTime}
          </Text>
        )}
      </View>
      <Markdown style={{
        body: {
          color: isAI ? currentTheme.colors.text : '#FFFFFF',
          fontSize: 16,
          lineHeight: 24,
          letterSpacing: 0.3,
        },
        heading1: {
          color: isAI ? currentTheme.colors.text : '#FFFFFF',
          fontSize: 20,
          fontWeight: '700',
          marginVertical: 8,
        },
        heading2: {
          color: isAI ? currentTheme.colors.text : '#FFFFFF',
          fontSize: 18,
          fontWeight: '600',
          marginVertical: 6,
        },
        list_item: {
          marginVertical: 4,
        },
        bullet_list: {
          marginVertical: 8,
        },
        strong: {
          color: isAI ? currentTheme.colors.primary : '#FFFFFF',
          fontWeight: '700',
        },
        em: {
          fontStyle: 'italic',
        },
        link: {
          color: isAI ? currentTheme.colors.primary : '#FFFFFF',
          textDecorationLine: 'underline',
        },
        code_inline: {
          fontFamily: 'monospace',
          backgroundColor: isAI ? `${currentTheme.colors.primary}20` : 'rgba(255, 255, 255, 0.2)',
          paddingHorizontal: 4,
          borderRadius: 4,
        },
        code_block: {
          backgroundColor: isAI ? `${currentTheme.colors.primary}10` : 'rgba(255, 255, 255, 0.1)',
          padding: 8,
          borderRadius: 8,
          marginVertical: 8,
        },
      }}>
        {item.content}
      </Markdown>
      {isAI && item.followUpOptions && item.followUpOptions.length > 0 && (
        <View style={styles.optionsContainer}>
          {item.followUpOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                { backgroundColor: `${currentTheme.colors.primary}20` }
              ]}
              onPress={() => onFollowUpSelect?.(option, item.content)}
            >
              <Text style={[styles.optionText, { color: currentTheme.colors.primary }]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </Animated.View>
  );
});

const FrequencySelector = ({ 
  question,
  frequency,
  currentTheme,
  onSelect,
  value
}: {
  question: string;
  frequency: { duration: string[]; frequency: string[] };
  currentTheme: any;
  onSelect: (type: 'duration' | 'frequency', value: string) => void;
  value?: { duration?: string; frequency?: string };
}) => {
  return (
    <View style={styles.frequencyContainer}>
      <View style={styles.frequencySection}>
        <Text style={[styles.frequencyLabel, { color: currentTheme.colors.text }]}>
          Duration:
        </Text>
        <View style={styles.optionsContainer}>
          {frequency.duration.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                { backgroundColor: currentTheme.colors.background },
                value?.duration === option && {
                  backgroundColor: `${currentTheme.colors.primary}20`,
                  borderColor: currentTheme.colors.primary,
                }
              ]}
              onPress={() => onSelect('duration', option)}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: currentTheme.colors.text },
                  value?.duration === option && {
                    color: currentTheme.colors.primary,
                    fontWeight: '600',
                  }
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.frequencySection}>
        <Text style={[styles.frequencyLabel, { color: currentTheme.colors.text }]}>
          Frequency:
        </Text>
        <View style={styles.optionsContainer}>
          {frequency.frequency.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                { backgroundColor: currentTheme.colors.background },
                value?.frequency === option && {
                  backgroundColor: `${currentTheme.colors.primary}20`,
                  borderColor: currentTheme.colors.primary,
                }
              ]}
              onPress={() => onSelect('frequency', option)}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: currentTheme.colors.text },
                  value?.frequency === option && {
                    color: currentTheme.colors.primary,
                    fontWeight: '600',
                  }
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const FollowUpControls = React.memo(({ 
  round, 
  currentTheme,
  onSubmit,
}: { 
  round: FollowUpRound;
  currentTheme: any;
  onSubmit: (answers: FollowUpAnswer[]) => void;
}) => {
  const [answers, setAnswers] = useState<FollowUpAnswer[]>([]);

  const handleFrequencySelect = (question: string, type: 'duration' | 'frequency', value: string) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.question === question);
      const currentValue = existing?.answer as { duration?: string; frequency?: string } || {};
      
      const newAnswer = {
        ...currentValue,
        [type]: value
      };

      if (existing) {
        return prev.map(a => 
          a.question === question ? { ...a, answer: newAnswer } : a
        );
      }
      return [...prev, { question, answer: newAnswer }];
    });
  };

  const handleToggleAnswer = (question: string, answer: string) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.question === question);
      if (existing) {
        if (existing.answer === answer) {
          return prev.filter(a => a.question !== question);
        }
        return prev.map(a => 
          a.question === question ? { ...a, answer } : a
        );
      }
      return [...prev, { question, answer }];
    });
  };

  const handleMultiToggleAnswer = (question: string, answer: string) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.question === question);
      if (existing) {
        const currentAnswers = String(existing.answer).split(', ');
        let newAnswers: string[];
        if (currentAnswers.includes(answer)) {
          newAnswers = currentAnswers.filter(a => a !== answer);
        } else {
          newAnswers = [...currentAnswers, answer];
        }
        if (newAnswers.length === 0) {
          return prev.filter(a => a.question !== question);
        }
        return prev.map(a => 
          a.question === question ? { ...a, answer: newAnswers.join(', ') } : a
        );
      }
      return [...prev, { question, answer }];
    });
  };

  const handleSliderAnswer = (question: string, value: number) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.question === question);
      if (existing) {
        return prev.map(a => 
          a.question === question ? { ...a, answer: value } : a
        );
      }
      return [...prev, { question, answer: value }];
    });
  };

  const isAnswerSelected = (question: string, answer: string) => {
    const existing = answers.find(a => a.question === question);
    if (!existing) return false;
    if (typeof existing.answer === 'string') {
      return existing.answer.split(', ').includes(answer);
    }
    return String(existing.answer) === answer;
  };

  const getFrequencyValue = (question: string) => {
    const answer = answers.find(a => a.question === question)?.answer;
    if (answer && typeof answer === 'object') {
      return answer as { duration?: string; frequency?: string };
    }
    return undefined;
  };

  const canSubmit = answers.length === round.questions.length &&
    answers.every(a => {
      if (typeof a.answer === 'object') {
        const freq = a.answer as { duration?: string; frequency?: string };
        return freq.duration && freq.frequency;
      }
      return true;
    });

  return (
    <View style={[styles.followUpContainer, { backgroundColor: currentTheme.colors.card }]}>
      <Text style={[styles.followUpTitle, { color: currentTheme.colors.text }]}>
        {round.round === 1 ? "Let's start with some basic questions" :
         round.round === 2 ? "Let's explore your symptoms further" :
         "Just a few final questions"}
      </Text>
      {round.questions.map((q, qIndex) => (
        <View key={qIndex} style={styles.questionContainer}>
          <Text style={[styles.questionText, { color: currentTheme.colors.text }]}>
            {q.question}
          </Text>
          {q.type === 'frequency' && q.frequency ? (
            <FrequencySelector
              question={q.question}
              frequency={q.frequency}
              currentTheme={currentTheme}
              onSelect={(type, value) => handleFrequencySelect(q.question, type, value)}
              value={getFrequencyValue(q.question)}
            />
          ) : q.type === 'slider' ? (
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={q.min || 1}
                maximumValue={q.max || 10}
                step={1}
                value={
                  Number(answers.find(a => a.question === q.question)?.answer) || 
                  (q.min || 1)
                }
                onValueChange={(value: number) => handleSliderAnswer(q.question, value)}
                minimumTrackTintColor={currentTheme.colors.primary}
                maximumTrackTintColor={`${currentTheme.colors.primary}40`}
                thumbTintColor={currentTheme.colors.primary}
              />
              <Text style={[styles.sliderValue, { color: currentTheme.colors.text }]}>
                {(() => {
                  const answer = answers.find(a => a.question === q.question)?.answer;
                  return typeof answer === 'number' ? answer : q.min || 1;
                })()}
              </Text>
            </View>
          ) : (
            <View style={styles.optionsContainer}>
              {q.options?.map((option, oIndex) => (
                <TouchableOpacity
                  key={oIndex}
                  style={[
                    styles.optionButton,
                    { backgroundColor: currentTheme.colors.background },
                    isAnswerSelected(q.question, option) && {
                      backgroundColor: `${currentTheme.colors.primary}20`,
                      borderColor: currentTheme.colors.primary,
                    }
                  ]}
                  onPress={() => 
                    q.type === 'multi-toggle' 
                      ? handleMultiToggleAnswer(q.question, option)
                      : handleToggleAnswer(q.question, option)
                  }
                >
                  <Text 
                    style={[
                      styles.optionText,
                      { color: currentTheme.colors.text },
                      isAnswerSelected(q.question, option) && {
                        color: currentTheme.colors.primary,
                        fontWeight: '600',
                      }
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}
      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: currentTheme.colors.primary },
          !canSubmit && styles.disabledButton
        ]}
        disabled={!canSubmit}
        onPress={() => onSubmit(answers)}
      >
        <Text style={styles.submitButtonText}>
          {round.round === 3 ? 'Get Analysis' : 'Continue'}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const CTAButtons = ({ 
  currentTheme,
  onNewCheck,
  onAppointment,
  onContactDoctor 
}: { 
  currentTheme: any;
  onNewCheck: () => void;
  onAppointment: () => void;
  onContactDoctor: () => void;
}) => {
  return (
    <View style={styles.ctaContainer}>
      <TouchableOpacity
        style={[styles.ctaButton, { backgroundColor: currentTheme.colors.primary }]}
        onPress={onNewCheck}
      >
        <MessageCircle stroke="#FFFFFF" width={24} height={24} />
        <Text style={styles.ctaButtonText}>New Symptom Check</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.ctaButton, { backgroundColor: currentTheme.colors.primary }]}
        onPress={onAppointment}
      >
        <Calendar stroke="#FFFFFF" width={24} height={24} />
        <Text style={styles.ctaButtonText}>Get Appointment</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.ctaButton, { backgroundColor: currentTheme.colors.primary }]}
        onPress={onContactDoctor}
      >
        <Phone stroke="#FFFFFF" width={24} height={24} />
        <Text style={styles.ctaButtonText}>Contact Doctor</Text>
      </TouchableOpacity>
    </View>
  );
};

const HomeScreen = () => {
  const { theme } = useTheme();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [symptoms, setSymptoms] = useState('');
  const flatListRef = useRef<FlatList>(null);
  
  // Add initial welcome message
  const initialMessage: Message = {
    id: 'welcome',
    role: 'assistant',
    content: "👋 Welcome! I'm your AI health assistant. You can describe any symptoms you're experiencing, and I'll help assess them.\n\nFor example, you could write:\n\"I have a mild headache and feeling dizzy\"\n\nYou can also select from the suggestions that appear as you type. I'm here to help you understand your symptoms better.",
    timestamp: Date.now(),
  };
  
  const {
    suggestions,
    messages,
    isAnalyzing,
    currentRound,
    showCTAs,
    getSymptomsInput,
    submitSymptoms,
    handleFollowUpResponse,
    submitRoundAnswers,
    resetAnalysis,
    setMessages,
  } = useSymptomAnalysis();

  // Set initial message if messages is empty
  React.useEffect(() => {
    if (messages.length === 0) {
      setMessages([initialMessage]);
    }
  }, [messages, setMessages, initialMessage]);

  const debouncedGetSuggestions = useCallback(
    debounce((text: string) => {
      getSymptomsInput(text);
    }, 300),
    []
  );

  const handleSymptomChange = (text: string) => {
    setSymptoms(text);
    debouncedGetSuggestions(text);
  };

  const handleSubmit = async () => {
    if (symptoms.trim()) {
      await submitSymptoms(symptoms.trim());
      setSymptoms('');
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  const renderMessage = useCallback(({ item }: { item: { id: string; role: string; content: string, followUpOptions?: string[] }}) => {
    return (
      <MessageItem 
        item={item} 
        currentTheme={currentTheme}
        onFollowUpSelect={handleFollowUpResponse}
      />
    );
  }, [currentTheme, handleFollowUpResponse]);

  const handleNewCheck = useCallback(() => {
    resetAnalysis();
  }, [resetAnalysis]);

  const handleAppointment = useCallback(() => {
    // Navigate to appointments screen
    navigation.navigate('Appointments');
  }, [navigation]);

  const handleContactDoctor = useCallback(() => {
    // Implement doctor contact functionality
    // For now, just show an alert
    Alert.alert(
      'Contact Doctor',
      'This feature will be available soon.',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
    );
  }, []);

  const handleReset = useCallback(() => {
    Alert.alert(
      'Reset Symptom Assessment',
      'This will clear the current chat session. Are you sure you want to continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => resetAnalysis()
        }
      ]
    );
  }, [resetAnalysis]);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: currentTheme.colors.background }]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={() => 
          isAnalyzing ? (
            <TypingIndicator />
          ) : currentRound ? (
            <FollowUpControls
              round={currentRound}
              currentTheme={currentTheme}
              onSubmit={submitRoundAnswers}
            />
          ) : showCTAs ? (
            <CTAButtons
              currentTheme={currentTheme}
              onNewCheck={handleNewCheck}
              onAppointment={handleAppointment}
              onContactDoctor={handleContactDoctor}
            />
          ) : null
        }
      />

      {/* Input Area - Only show if not showing CTAs */}
      {!showCTAs && (
        <View style={[styles.inputArea, { backgroundColor: currentTheme.colors.card }]}>
          {suggestions.length > 0 && (
            <View style={[styles.suggestionsContainer, { backgroundColor: currentTheme.colors.background }]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {suggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.suggestionChip, { backgroundColor: currentTheme.colors.primary + '20' }]}
                    onPress={() => setSymptoms(suggestion)}
                  >
                    <Text style={[styles.suggestionText, { color: currentTheme.colors.primary }]}>
                      {suggestion}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
          <View style={[styles.inputContainer, { backgroundColor: currentTheme.colors.background }]}>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: currentTheme.colors.primary + '20' }]}
              onPress={handleReset}
            >
              <RotateCcw stroke={currentTheme.colors.primary} width={20} height={20} />
            </TouchableOpacity>
            <TextInput
              style={[styles.input, { color: currentTheme.colors.text }]}
              value={symptoms}
              onChangeText={handleSymptomChange}
              placeholder="Describe your symptoms..."
              placeholderTextColor={`${currentTheme.colors.text}80`}
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: currentTheme.colors.primary },
                isAnalyzing && styles.disabledButton
              ]}
              onPress={handleSubmit}
              disabled={isAnalyzing || !symptoms.trim()}
            >
              {isAnalyzing ? (
                <Activity stroke="#FFFFFF" width={20} height={20} />
              ) : (
                <Send stroke="#FFFFFF" width={20} height={20} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 16,
    gap: 8,
  },
  inputArea: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    padding: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  iconButton: {
    padding: 12,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    padding: 12,
    borderRadius: 20,
  },
  suggestionsContainer: {
    padding: 8,
    borderRadius: 16,
    marginBottom: 8,
  },
  suggestionChip: {
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  messageBubble: {
    width: '100%',
    padding: 16,
    marginBottom: 8,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 60,
  },
  userMessage: {
    maxWidth: '85%',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
    backgroundColor: '#4FD1C5',
    padding: 12,
  },
  aiMessage: {
    width: '100%',
    alignSelf: 'stretch',
    borderBottomLeftRadius: 4,
    backgroundColor: '#1E293B',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleIcon: {
    marginRight: 6,
  },
  messageRole: {
    fontSize: 12,
    fontWeight: '600',
  },
  messageTime: {
    fontSize: 11,
    fontWeight: '500',
  },
  messageGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  followUpContainer: {
    width: '100%',
    padding: 16,
    borderRadius: 20,
    marginTop: 2,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignSelf: 'stretch',
    backgroundColor: '#1E293B',
  },
  followUpTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionText: {
    fontSize: 14,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: '600',
    width: 30,
    textAlign: 'center',
  },
  submitButton: {
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  typingContainer: {
    flexDirection: 'column',
    padding: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    height: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
    opacity: 0.3,
  },
  frequencyContainer: {
    gap: 16,
  },
  frequencySection: {
    gap: 8,
  },
  frequencyLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  ctaContainer: {
    padding: 16,
    gap: 12,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;

