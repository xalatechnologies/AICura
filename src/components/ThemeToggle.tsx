import React from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@theme/ThemeContext';

export const ThemeToggle = () => {
  const { colorScheme, toggleColorScheme, theme } = useTheme();
  const rotateAnim = new Animated.Value(colorScheme === 'light' ? 0 : 1);

  const handlePress = async () => {
    Animated.timing(rotateAnim, {
      toValue: colorScheme === 'light' ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    await toggleColorScheme();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.colors.card }]}
      onPress={handlePress}
    >
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Icon
          name={colorScheme === 'light' ? 'light-mode' : 'dark-mode'}
          size={24}
          color={theme.colors.primary}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 