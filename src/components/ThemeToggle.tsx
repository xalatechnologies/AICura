import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export const ThemeToggle = () => {
  const { t } = useTranslation();
  const { colors, dark, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(dark ? 'light' : 'dark');
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={toggleTheme}
    >
      <View style={styles.content}>
        <Icon
          name={dark ? 'moon-outline' : 'sunny-outline'}
          size={24}
          color={colors.text}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: colors.text }]}>
            {t('profile.darkMode')}
          </Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {dark ? t('common.on') : t('common.off')}
          </Text>
        </View>
      </View>
      <Icon
        name={dark ? 'toggle' : 'toggle-outline'}
        size={32}
        color={colors.primary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
}); 