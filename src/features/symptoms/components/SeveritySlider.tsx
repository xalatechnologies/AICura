import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTheme } from '@theme/ThemeContext';

interface SeveritySliderProps {
  severity: number;
  onValueChange: (value: number) => void;
}

export const SeveritySlider: React.FC<SeveritySliderProps> = ({
  severity,
  onValueChange,
}) => {
  const { colors } = useTheme();

  const severityDescriptions = [
    'No Pain',
    'Mild',
    'Moderate',
    'Severe',
    'Very Severe',
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Severity Level: {severity} -{' '}
        {severityDescriptions[Math.floor(severity / 2)]}
      </Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={10}
        step={1}
        value={severity}
        onValueChange={onValueChange}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor="#ccc"
        thumbTintColor={colors.primary}
        accessibilityLabel="Adjust Symptom Severity"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 4,
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
  },
}); 