import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  disabled,
  loading,
  variant = 'primary'
}: ButtonProps) => {
  const { colors } = useTheme();

  const getColors = (): [string, string] => {
    if (disabled) {
      return [colors.textSecondary, colors.textSecondary];
    }
    switch (variant) {
      case 'primary':
        return [colors.primary, colors.primaryDark];
      case 'secondary':
        return [colors.secondary, colors.secondaryDark];
      case 'outline':
        return ['transparent', 'transparent'];
      default:
        return [colors.primary, colors.primaryDark];
    }
  };

  const getTextColor = () => {
    if (disabled) {
      return '#FFFFFF';
    }
    if (variant === 'outline') {
      return colors.primary;
    }
    return '#FFFFFF';
  };

  const getBorderColor = () => {
    if (variant === 'outline') {
      return colors.primary;
    }
    return 'transparent';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.container, style]}
    >
      <LinearGradient
        colors={getColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.gradient,
          { borderColor: getBorderColor(), borderWidth: variant === 'outline' ? 1 : 0 }
        ]}
      >
        {loading ? (
          <ActivityIndicator color={getTextColor()} />
        ) : (
          <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 