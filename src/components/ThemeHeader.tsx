import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@theme/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/RootNavigator';

interface ThemeHeaderProps {
  showBack?: boolean;
  showLanguage?: boolean;
}

export const ThemeHeader = ({ showBack = false, showLanguage = true }: ThemeHeaderProps) => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {showBack && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.card }]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      )}
      <View style={styles.rightButtons}>
        {showLanguage && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.card }]}
            onPress={() => navigation.navigate('LanguageSelection')}
          >
            <Icon name="language" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
        <ThemeToggle />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 