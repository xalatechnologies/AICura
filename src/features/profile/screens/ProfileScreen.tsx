import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Header } from '@/components/shared/Header';

const ProfileScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title={t('profile.title')}
        rightAction={{
          icon: 'settings',
          onPress: () => {/* Handle settings */}
        }}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('profile.settings')}
          </Text>
          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingContent}>
              <Icon name="language" size={24} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                {t('profile.language')}
              </Text>
            </View>
          </View>
          <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
            <View style={styles.settingContent}>
              <Icon name="dark-mode" size={24} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                {t('profile.darkMode')}
              </Text>
            </View>
            <ThemeToggle />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.error }]}
          onPress={handleLogout}
        >
          <Icon name="logout" size={24} color="#FFFFFF" />
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfileScreen; 