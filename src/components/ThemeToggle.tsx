import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={toggleTheme}
    >
      <Icon 
        name={isDark ? 'moon' : 'sunny'} 
        size={24} 
        color={isDark ? '#FDB813' : '#FDB813'} 
      />
      <Text style={styles.text}>
        {isDark ? 'Dark Mode' : 'Light Mode'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 