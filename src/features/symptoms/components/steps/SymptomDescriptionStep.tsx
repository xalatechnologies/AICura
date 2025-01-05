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
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { getSymptomSuggestions } from '@/services/ai';

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

  const fetchSuggestions = useCallback(
    async (input: string) => {
      if (input.length < 3) {
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
    },
    []
  );

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (inputText) {
        fetchSuggestions(inputText);
      }
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [inputText, fetchSuggestions]);

  const handleDescriptionChange = (text: string) => {
    setInputText(text);
    onDataChange?.({ description: selectedSymptoms.map(s => s.text).join(', ') + (text ? ', ' + text : '') });
  };

  const handleSuggestionPress = (suggestion: Suggestion) => {
    if (!selectedSymptoms.some(s => s.id === suggestion.id)) {
      const newSymptoms = [...selectedSymptoms, suggestion];
      setSelectedSymptoms(newSymptoms);
      setInputText('');
      onDataChange?.({ description: newSymptoms.map(s => s.text).join(', ') });
    }
    setSuggestions([]);
  };

  const removeSymptom = (symptomId: string) => {
    const newSymptoms = selectedSymptoms.filter(s => s.id !== symptomId);
    setSelectedSymptoms(newSymptoms);
    onDataChange?.({ description: newSymptoms.map(s => s.text).join(', ') });
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.contentContainer}>
        <View style={[styles.inputWrapper, { backgroundColor: colors.card }]}>
          <View style={styles.tagsContainer}>
            {selectedSymptoms.map((symptom) => (
              <View key={symptom.id} style={[styles.tagContainer, { backgroundColor: colors.primary }]}>
                <Text style={[styles.tagText, { color: colors.textInverted }]}>{symptom.text}</Text>
                <TouchableOpacity onPress={() => removeSymptom(symptom.id)} style={styles.tagRemoveButton}>
                  <Icon name="close-circle" size={18} color={colors.textInverted} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={inputText}
            onChangeText={handleDescriptionChange}
            placeholder={selectedSymptoms.length === 0 ? t('symptoms.description.placeholder') : t('symptoms.description.addMore')}
            placeholderTextColor={colors.textSecondary}
            multiline
            textAlignVertical="top"
            autoCapitalize="sentences"
            autoCorrect
            blurOnSubmit={false}
          />
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
        </View>
        
        {suggestions.length > 0 && (
          <View style={[styles.suggestionsContainer, { backgroundColor: colors.card }]}>
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.suggestionItem, { borderBottomColor: colors.border }]}
                  onPress={() => handleSuggestionPress(item)}
                >
                  <Text style={[styles.suggestionText, { color: colors.text }]}>
                    {item.text}
                  </Text>
                </TouchableOpacity>
              )}
              keyboardShouldPersistTaps="always"
            />
          </View>
        )}
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              {t('symptoms.description.loading')}
            </Text>
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
  headerContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  inputWrapper: {
    borderRadius: 12,
    padding: 16,
    minHeight: 150,
    marginBottom: Platform.OS === 'ios' ? 20 : 0,
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
  },
  suggestionsContainer: {
    maxHeight: 200,
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
  },
  suggestionText: {
    fontSize: 16,
  },
  loadingContainer: {
    padding: 12,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  tagText: {
    fontSize: 14,
    marginRight: 4,
  },
  tagRemoveButton: {
    padding: 2,
  },
});