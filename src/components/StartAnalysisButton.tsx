import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface StartAnalysisButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export const StartAnalysisButton: React.FC<StartAnalysisButtonProps> = ({
  onPress,
  disabled = false,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: disabled ? colors.border : colors.primary,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <MaterialCommunityIcons
        name="stethoscope"
        size={24}
        color="#FFFFFF"
      />
      <Text style={styles.text}>Start New Symptom Analysis</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 