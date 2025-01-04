import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@theme/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@navigation/RootNavigator';
import { LinearGradient } from 'expo-linear-gradient';

interface ThemeHeaderProps {
  showBack?: boolean;
  showLanguage?: boolean;
}

export const ThemeHeader = ({ showBack = false, showLanguage = true }: ThemeHeaderProps) => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <LinearGradient
      colors={[colors.background, colors.surface]}
      style={styles.container}
    >
      <View style={styles.content}>
        {showBack && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.card }]}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
        <View style={styles.rightButtons}>
          {showLanguage && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.card }]}
              onPress={() => navigation.navigate('LanguageSelection')}
            >
              <Icon name="language" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
          <ThemeToggle />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rightButtons: {
    flexDirection: 'row',
    gap: 12,
    marginLeft: 'auto',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
}); 