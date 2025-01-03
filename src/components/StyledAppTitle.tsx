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
        return 24;
      case 'large':
        return 36;
      default:
        return 28;
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
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 4,
        }
      ]}>
        AI
      </Text>
      <Text style={[
        styles.curaText,
        { 
          fontSize: getFontSize(),
          color: colors.text,
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
    justifyContent: 'center',
  },
  aiText: {
    fontWeight: '900',
    fontFamily: 'Inter-Black',
  },
  curaText: {
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});
