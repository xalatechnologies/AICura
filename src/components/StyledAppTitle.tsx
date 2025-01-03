import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '@theme/ThemeContext';

interface StyledAppTitleProps {
  size?: 'small' | 'medium' | 'large';
}

export const StyledAppTitle = ({ size = 'medium' }: StyledAppTitleProps) => {
  const { colors } = useTheme();

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 28;
      case 'large':
        return 48;
      default:
        return 36;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[
        styles.aiText,
        { 
          fontSize: getFontSize(),
          color: colors.primary,
          textShadowColor: colors.primary,
          textShadowOffset: { width: 2, height: 2 },
          textShadowRadius: 6,
        }
      ]}>
        AI
      </Text>
      <Text style={[
        styles.curaText,
        { 
          fontSize: getFontSize(),
          color: colors.text 
        }
      ]}>
        Cura
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiText: {
    fontFamily: 'Roboto-Bold',
    letterSpacing: 2,
  },
  curaText: {
    fontFamily: 'Roboto-Light',
    letterSpacing: 1,
  },
}); 