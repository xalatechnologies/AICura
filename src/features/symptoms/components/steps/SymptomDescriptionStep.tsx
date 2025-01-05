import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  Animated,
  Vibration,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { getSymptomSuggestions } from '@/services/ai';
import { LinearGradient } from 'expo-linear-gradient';

interface SymptomDescriptionStepProps {
  onDataChange?: (data: any) => void;
}

interface Suggestion {
  id: string;
  text: string;
}

export const SymptomDescriptionStep: React.FC<SymptomDescriptionStepProps> = ({
  onDataChange,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Suggestion[]>([]);
  const [inputText, setInputText] = useState('');
  const [pulseAnim] = useState(new Animated.Value(1));
  const [showEmptyState, setShowEmptyState] = useState(true);

  // Pulse animation for the record button
  const startPulseAnimation = useCallback(() => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.2,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (isRecording) {
        startPulseAnimation();
      }
    });
  }, [isRecording, pulseAnim]);

  useEffect(() => {
    if (isRecording) {
      startPulseAnimation();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    Vibration.vibrate(50);
  };

  const handleDescriptionChange = (text: string) => {
    setInputText(text);
    setShowEmptyState(false);
  };

  const handleSuggestionPress = (suggestion: Suggestion) => {
    if (!selectedSymptoms.find(s => s.id === suggestion.id)) {
      setSelectedSymptoms([...selectedSymptoms, suggestion]);
      setInputText('');
      Vibration.vibrate(50);
    }
  };

  const removeSymptom = (id: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s.id !== id));
    Vibration.vibrate(50);
  };

  const fetchSuggestions = useCallback(async (input: string) => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const suggestionTexts = await getSymptomSuggestions(input);
      const newSuggestions = suggestionTexts.map((text, index) => ({
        id: `${index}-${text}`,
        text,
      }));
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (inputText) {
        fetchSuggestions(inputText);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [inputText, fetchSuggestions]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      flex: 1,
      padding: 16,
    },
    inputWrapper: {
      borderRadius: 16,
      padding: 16,
      minHeight: 150,
      marginBottom: Platform.OS === 'ios' ? 20 : 0,
      backgroundColor: colors.surface,
      shadowColor: colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    emptyStateIcon: {
      marginBottom: 16,
      opacity: 0.9,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 8,
      textAlign: 'center',
      color: colors.text,
    },
    emptyStateSubtitle: {
      fontSize: 14,
      textAlign: 'center',
      opacity: 0.7,
      color: colors.textSecondary,
    },
    input: {
      flex: 1,
      fontSize: 16,
      lineHeight: 24,
      minHeight: 120,
      maxHeight: 200,
      textAlignVertical: 'top',
      paddingBottom: 40,
      color: colors.text,
    },
    voiceButton: {
      position: 'absolute',
      bottom: 16,
      right: 16,
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primary,
      shadowColor: colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingBottom: 8,
      gap: 8,
    },
    tagContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: colors.primary,
    },
    tagText: {
      fontSize: 14,
      marginRight: 4,
      fontWeight: '500',
      color: colors.textInverted,
    },
    tagRemoveButton: {
      padding: 2,
    },
    suggestionsContainer: {
      maxHeight: 200,
      borderRadius: 16,
      marginTop: 8,
      overflow: 'hidden',
      backgroundColor: colors.surface,
      shadowColor: colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    suggestionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    suggestionIcon: {
      marginRight: 8,
    },
    suggestionText: {
      fontSize: 16,
      color: colors.text,
    },
    loadingItem: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 16,
    },
    loadingContainer: {
      padding: 12,
      alignItems: 'center',
    },
    loadingIndicator: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderRadius: 10,
      borderColor: colors.primary,
      borderRightColor: 'transparent',
      marginBottom: 8,
      transform: [{ rotate: '45deg' }],
    },
    loadingText: {
      fontSize: 14,
      color: colors.text,
    },
    tagWrapper: {
      marginVertical: 2,
      marginHorizontal: 2,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.surface,
      borderRadius: 12,
      marginTop: 8,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      paddingVertical: 8,
      color: colors.text,
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <View style={styles.inputWrapper}>
          {showEmptyState ? (
            <View style={styles.emptyState}>
              <Icon
                name="medical"
                size={48}
                color={colors.primary}
                style={styles.emptyStateIcon}
              />
              <Text style={styles.emptyStateTitle}>
                {t('symptoms.steps.description.emptyState.title')}
              </Text>
              <Text style={styles.emptyStateSubtitle}>
                {t('symptoms.steps.description.emptyState.subtitle')}
              </Text>
            </View>
          ) : null}
          
          <View style={styles.tagsContainer}>
            {selectedSymptoms.map((symptom) => (
              <View key={symptom.id} style={styles.tagContainer}>
                <Text style={styles.tagText}>{symptom.text}</Text>
                <TouchableOpacity
                  onPress={() => removeSymptom(symptom.id)}
                  style={styles.tagRemoveButton}
                  accessible={true}
                  accessibilityLabel={t('symptoms.steps.description.actions.remove', { symptom: symptom.text })}
                >
                  <Icon name="close-circle" size={18} color={colors.textInverted} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={handleDescriptionChange}
            placeholder={t('symptoms.steps.description.searchPlaceholder')}
            placeholderTextColor={colors.textSecondary}
            multiline
            accessible={true}
            accessibilityLabel={t('symptoms.steps.description.searchPlaceholder')}
            accessibilityHint={t('symptoms.steps.description.searchHint')}
          />

          <TouchableOpacity
            style={[
              styles.voiceButton,
              isRecording && { backgroundColor: colors.error },
            ]}
            onPress={handleVoiceInput}
            accessible={true}
            accessibilityLabel={t(isRecording 
              ? 'symptoms.steps.description.voiceInput.stop'
              : 'symptoms.steps.description.voiceInput.start')}
          >
            <Animated.View
              style={{
                transform: [{ scale: pulseAnim }],
              }}
            >
              <Icon
                name={isRecording ? 'mic' : 'mic-outline'}
                size={24}
                color={colors.textInverted}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>

        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionPress(item)}
                  accessible={true}
                  accessibilityLabel={t('symptoms.steps.description.actions.add', { symptom: item.text })}
                >
                  <Icon
                    name="add-circle-outline"
                    size={20}
                    color={colors.primary}
                    style={styles.suggestionIcon}
                  />
                  <Text style={styles.suggestionText}>{item.text}</Text>
                </TouchableOpacity>
              )}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        )}

        {isLoading && (
          <View style={styles.suggestionsContainer}>
            <View style={[styles.suggestionItem, styles.loadingItem]}>
              <Text style={styles.suggestionText}>
                {t('symptoms.steps.description.suggestions.loading')}
              </Text>
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};