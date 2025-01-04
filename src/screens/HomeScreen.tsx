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
  ActivityIndicator,
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
import { useTheme } from '@theme/ThemeContext';
import { Moon, MessageCircle, Calendar, Activity, Send, Phone, RotateCcw } from 'react-native-feather';
import { useSymptomAnalysis } from '@hooks/useSymptomAnalysis';
import { debounce } from 'lodash';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle } from 'react-native-svg';
import Markdown from 'react-native-markdown-display';
import { Message, FollowUpRound, FollowUpAnswer } from '../hooks/useSymptomAnalysis';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/RootNavigator';
import type { MainTabsParamList } from '@navigation/MainTabs';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabsParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export const HomeScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [followUpRound, setFollowUpRound] = useState<FollowUpRound | null>(null);
  const [followUpAnswers, setFollowUpAnswers] = useState<FollowUpAnswer[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const { analyzeSymptoms } = useSymptomAnalysis();

  const handleSend = async () => {
    if (!symptoms.trim() || loading) return;

    const userMessage: Message = {
      type: 'user',
      content: symptoms.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setSymptoms('');
    setLoading(true);

    try {
      const result = await analyzeSymptoms(userMessage.content);
      setMessages(prev => [...prev, ...result.messages]);
      setFollowUpRound(result.followUpRound);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      Alert.alert('Error', 'Failed to analyze symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentPress = () => {
    navigation.navigate('Appointments');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                message.type === 'user'
                  ? [styles.userMessage, { backgroundColor: colors.userMessage }]
                  : [styles.aiMessage, { backgroundColor: colors.aiMessage, borderColor: colors.aiMessageBorder }],
              ]}
            >
              <Markdown
                style={{
                  body: { color: colors.text },
                  link: { color: colors.primary },
                  bullet_list: { color: colors.text },
                  ordered_list: { color: colors.text },
                  heading1: { color: colors.text, fontWeight: 'bold' },
                  heading2: { color: colors.text, fontWeight: 'bold' },
                  code_block: { 
                    backgroundColor: colors.surface,
                    color: colors.text,
                    padding: 8,
                    borderRadius: 4,
                  },
                }}
              >
                {message.content}
              </Markdown>
      </View>
          ))}

          {loading && (
            <View style={[styles.loadingContainer, { backgroundColor: colors.surface }]}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                Analyzing...
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
            <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Describe your symptoms..."
            placeholderTextColor={colors.textSecondary}
              value={symptoms}
            onChangeText={setSymptoms}
              multiline
            />
            <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: colors.primary }]}
            onPress={handleSend}
            disabled={loading || !symptoms.trim()}
          >
            <Send stroke={colors.background} width={20} height={20} />
            </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 8,
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    padding: 12,
    borderRadius: 16,
    marginVertical: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    marginRight: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;

