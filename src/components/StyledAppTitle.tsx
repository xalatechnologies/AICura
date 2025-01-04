import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@theme/ThemeContext';

interface StyledAppTitleProps {
  size?: 'small' | 'medium' | 'large';
}

export const StyledAppTitle: React.FC<StyledAppTitleProps> = ({ size = 'medium' }) => {
  const { colors } = useTheme();

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 24;
      case 'large':
        return 36;
      default:
        return 28;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: getFontSize() }]}>
        <Text style={{ color: colors.primary }}>AI</Text>
        <Text style={{ color: colors.text }}>Cura</Text>
        <Text style={{ color: colors.primary, fontSize: getFontSize() * 0.6 }}>™</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Helvetica Neue',
      android: 'sans-serif-medium',
    }),
    letterSpacing: 1,
  },
}); 