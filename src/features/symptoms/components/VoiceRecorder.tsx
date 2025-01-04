import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@/theme/ThemeContext';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

interface VoiceRecorderProps {
  isRecording: boolean;
  onTextChange: (text: string) => void;
}

export const VoiceRecorder = ({ isRecording, onTextChange }: VoiceRecorderProps) => {
  const { colors } = useTheme();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [recording]);

  const startPulse = () => {
    Animated.loop(
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
      ])
    ).start();
  };

  const stopPulse = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      startPulse();
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      stopPulse();
      const uri = recording.getURI();
      // Here you would typically send the audio file to a speech-to-text service
      // For now, we'll just simulate receiving text
      onTextChange("Recorded audio would be transcribed here");
    } catch (error) {
      console.error('Error stopping recording:', error);
    }

    setRecording(null);
  };

  const toggleRecording = async () => {
    if (recording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: recording ? colors.error : colors.primary }
        ]}
        onPress={toggleRecording}
      >
        <Icon 
          name={recording ? 'mic-off' : 'mic'} 
          size={24} 
          color="#FFFFFF" 
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
}); 