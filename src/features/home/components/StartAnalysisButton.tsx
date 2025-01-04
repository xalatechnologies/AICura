import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface StartAnalysisButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export const StartAnalysisButton: React.FC<StartAnalysisButtonProps> = ({ onPress, disabled }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: disabled ? colors.buttonDisabled : colors.buttonPrimary },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Icon name="stethoscope" size={24} color={colors.textInverted} style={styles.icon} />
      <Text style={[styles.text, { color: colors.textInverted }]}>Start New Symptom Analysis</Text>
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
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 