import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@theme/ThemeContext';
import { usePulseAnimation } from '../hooks/usePulseAnimation';

interface VoiceRecorderProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
}) => {
  const { colors } = useTheme();
  const pulseAnim = usePulseAnimation(isRecording);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.pulse, { opacity: pulseAnim }]}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={isRecording ? onStopRecording : onStartRecording}
          accessibilityLabel={isRecording ? 'Stop Recording' : 'Start Recording'}
        >
          <MaterialIcons
            name={isRecording ? 'stop' : 'mic'}
            size={24}
            color="#fff"
          />
          <Text style={styles.buttonText}>
            {isRecording ? 'Stop Recording' : 'Record Symptom'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    alignItems: 'center',
  },
  pulse: {
    borderRadius: 100,
  },
  button: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
}); 