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
    }, 300); // Faster response time

    return () => clearTimeout(debounceTimeout);
  }, [inputText, fetchSuggestions]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <View style={[styles.inputWrapper, { backgroundColor: colors.card }]}>
          {showEmptyState && selectedSymptoms.length === 0 ? (
            <TouchableOpacity 
              style={styles.emptyState}
              onPress={() => {
                const input = document.querySelector('input');
                if (input) input.focus();
              }}
            >
              <Icon name="search-outline" size={32} color={colors.primary} style={styles.emptyStateIcon} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                value={inputText}
                onChangeText={handleDescriptionChange}
                placeholder={t('symptoms.description.searchPlaceholder')}
                placeholderTextColor={colors.textSecondary}
                autoFocus
              />
            </TouchableOpacity>
          ) : (
            <>
              <View style={styles.tagsContainer}>
                {selectedSymptoms.map((symptom) => (
                  <Animated.View 
                    key={symptom.id} 
                    style={[
                      styles.tagWrapper,
                      {
                        opacity: new Animated.Value(1),
                        transform: [{ scale: new Animated.Value(1) }],
                      }
                    ]}
                  >
                    <LinearGradient
                      colors={[colors.primary, colors.primary + 'DD']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.tagContainer}
                    >
                      <Text style={[styles.tagText, { color: colors.textInverted }]}>{symptom.text}</Text>
                      <TouchableOpacity 
                        onPress={() => removeSymptom(symptom.id)} 
                        style={styles.tagRemoveButton}
                      >
                        <Icon name="close-circle" size={18} color={colors.textInverted} />
                      </TouchableOpacity>
                    </LinearGradient>
                  </Animated.View>
                ))}
              </View>
              <View style={styles.searchContainer}>
                <Icon name="search-outline" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  value={inputText}
                  onChangeText={handleDescriptionChange}
                  placeholder={selectedSymptoms.length === 0 ? t('symptoms.description.searchPlaceholder') : t('symptoms.description.addMore')}
                  placeholderTextColor={colors.textSecondary}
                />
                <Animated.View style={{
                  transform: [{ scale: pulseAnim }]
                }}>
                  <TouchableOpacity
                    style={[
                      styles.voiceButton,
                      { backgroundColor: isRecording ? colors.primary : colors.border },
                    ]}
                    onPress={handleVoiceInput}
                  >
                    <Icon
                      name={isRecording ? 'mic' : 'mic-outline'}
                      size={24}
                      color={isRecording ? colors.textInverted : colors.text}
                    />
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </>
          )}
        </View>
        
        {suggestions.length > 0 && (
          <Animated.View 
            style={[
              styles.suggestionsContainer,
              { 
                backgroundColor: colors.card,
                opacity: new Animated.Value(1),
                transform: [{ translateY: new Animated.Value(0) }],
              }
            ]}
          >
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.suggestionItem, { borderBottomColor: colors.border }]}
                  onPress={() => handleSuggestionPress(item)}
                >
                  <Icon name="add-circle-outline" size={20} color={colors.primary} style={styles.suggestionIcon} />
                  <Text style={[styles.suggestionText, { color: colors.text }]}>
                    {item.text}
                  </Text>
                </TouchableOpacity>
              )}
              keyboardShouldPersistTaps="always"
            />
          </Animated.View>
        )}
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Animated.View 
              style={[
                styles.loadingIndicator,
                { 
                  borderColor: colors.primary,
                  transform: [{ rotate: new Animated.Value(0).interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }) }],
                }
              ]}
            />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

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
    shadowColor: "#000",
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
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 120,
    maxHeight: 200,
    textAlignVertical: 'top',
    paddingBottom: 40,
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
    shadowColor: "#000",
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
  },
  tagText: {
    fontSize: 14,
    marginRight: 4,
    fontWeight: '500',
  },
  tagRemoveButton: {
    padding: 2,
  },
  suggestionsContainer: {
    maxHeight: 200,
    borderRadius: 16,
    marginTop: 8,
    overflow: 'hidden',
    shadowColor: "#000",
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
  },
  suggestionIcon: {
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 16,
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
    borderRightColor: 'transparent',
    marginBottom: 8,
    transform: [{ rotate: '45deg' }],
  },
  loadingText: {
    fontSize: 14,
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
    backgroundColor: colors.background,
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
  },
});