import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface InputProps extends TextInputProps {
  icon?: string;
  secureTextEntry?: boolean;
}

export const Input = ({ icon, secureTextEntry, ...props }: InputProps) => {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = secureTextEntry;

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: colors.card,
        borderColor: colors.border,
      }
    ]}>
      {icon && (
        <Icon 
          name={icon} 
          size={20} 
          color={colors.textSecondary}
          style={styles.icon} 
        />
      )}
      <TextInput
        {...props}
        style={[
          styles.input,
          { color: colors.text },
          icon && styles.inputWithIcon,
        ]}
        placeholderTextColor={colors.textSecondary}
        secureTextEntry={isPassword && !showPassword}
      />
      {isPassword && (
        <TouchableOpacity 
          onPress={() => setShowPassword(!showPassword)}
          style={styles.visibilityToggle}
        >
          <Icon
            name={showPassword ? 'visibility' : 'visibility-off'}
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 16,
  },
  inputWithIcon: {
    paddingLeft: 8,
  },
  icon: {
    marginLeft: 16,
  },
  visibilityToggle: {
    padding: 8,
    marginRight: 8,
  },
}); 