import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SymptomInputProps {
  onSubmit: (text: string) => void;
  suggestions: string[];
  isLoading?: boolean;
}

export const SymptomInput: React.FC<SymptomInputProps> = ({
  onSubmit,
  suggestions,
  isLoading = false,
}) => {
  const { colors } = useTheme();
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const recording = useRef<Audio.Recording | null>(null);
  const inputRef = useRef<TextInput>(null);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recording.current = newRecording;
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording.current) return;

    try {
      await recording.current.stopAndUnloadAsync();
      const uri = recording.current.getURI();
      setIsRecording(false);
      recording.current = null;

      if (uri) {
        // Here you would send the audio file to your AI service
        // and get back the transcribed text
        // For now, we'll just show a placeholder
        setText(prev => prev + ' [Voice Input] ');
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const handleSubmit = useCallback(() => {
    if (text.trim()) {
      onSubmit(text.trim());
      setText('');
      setShowSuggestions(false);
    }
  }, [text, onSubmit]);

  const handleTextChange = (value: string) => {
    setText(value);
    setShowSuggestions(value.length > 0);
  };

  return (
    <View style={styles.container}>
      {showSuggestions && suggestions.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.suggestionsContainer, { backgroundColor: colors.card }]}
        >
          {suggestions.map((suggestion) => (
            <TouchableOpacity
              key={suggestion}
              style={[styles.suggestionChip, { backgroundColor: colors.primary }]}
              onPress={() => setText(prev => `${prev}${prev ? ', ' : ''}${suggestion}`)}
            >
              <Text style={[styles.suggestionText, { color: '#FFFFFF' }]}>
                {suggestion}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: colors.text }]}
          value={text}
          onChangeText={handleTextChange}
          placeholder="Describe your symptoms..."
          placeholderTextColor={colors.textSecondary}
          multiline
          maxLength={500}
        />

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.iconButton, isRecording && styles.recordingButton]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Icon
              name={isRecording ? 'stop-circle' : 'microphone'}
              size={24}
              color={isRecording ? colors.error : colors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: colors.primary },
              (!text.trim() || isLoading) && { opacity: 0.6 },
            ]}
            onPress={handleSubmit}
            disabled={!text.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Icon name="send" size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  suggestionsContainer: {
    padding: 8,
    marginBottom: 8,
    borderRadius: 12,
  },
  suggestionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderRadius: 12,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  recordingButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  submitButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 