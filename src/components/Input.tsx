import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
  Platform,
  Text,
} from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface InputProps extends TextInputProps {
  icon?: string;
  containerStyle?: ViewStyle;
  error?: string;
  touched?: boolean;
}

export const Input: React.FC<InputProps> = ({
  icon,
  containerStyle,
  error,
  touched,
  secureTextEntry,
  style,
  ...props
}) => {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error && touched) return colors.error;
    if (isFocused) return colors.primary;
    return colors.inputBorder;
  };

  const getBackgroundColor = () => {
    if (error && touched) return `${colors.error}10`;
    if (isFocused) return colors.inputBackground;
    return colors.surface;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            borderWidth: isFocused ? 2 : 1,
            transform: [{ translateY: isFocused ? -1 : 0 }],
          },
        ]}
      >
        {icon && (
          <Icon
            name={icon}
            size={20}
            color={
              error && touched
                ? colors.error
                : isFocused
                ? colors.primary
                : colors.textSecondary
            }
            style={styles.icon}
          />
        )}
        <TextInput
          {...props}
          secureTextEntry={secureTextEntry && !showPassword}
          style={[
            styles.input,
            {
              color: colors.text,
              paddingLeft: icon ? 8 : 16,
            },
            style,
          ]}
          placeholderTextColor={colors.inputPlaceholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.passwordToggle}
          >
            <Icon
              name={showPassword ? 'visibility-off' : 'visibility'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && touched && (
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={14} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    paddingRight: 16,
  },
  icon: {
    marginLeft: 16,
  },
  passwordToggle: {
    padding: 8,
    marginRight: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 12,
    marginLeft: 4,
  },
}); 