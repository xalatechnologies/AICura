import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/RootNavigator';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { supabase } from '@/lib/supabase';
import { ThemeHeader } from '@components/ThemeHeader';
import { StyledAppTitle } from '@components/StyledAppTitle';

type ForgotPasswordScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;
};

export const ForgotPasswordScreen = ({ navigation }: ForgotPasswordScreenProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) return;
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      Alert.alert(
        t('auth.forgotPassword.successTitle'),
        t('auth.forgotPassword.successMessage')
      );
      navigation.goBack();
    } catch (error) {
      Alert.alert(t('common.error'), t('auth.forgotPassword.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ThemeHeader showBack showLanguage />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <StyledAppTitle size="medium" />
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            {t('auth.forgotPassword.description')}
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            placeholder={t('auth.forgotPassword.emailPlaceholder')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="email"
          />

          <Button
            title={t('auth.forgotPassword.resetButton')}
            onPress={handleResetPassword}
            loading={loading}
            style={styles.resetButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            {t('auth.forgotPassword.rememberPassword')}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.footerLink, { color: theme.colors.primary }]}>
              {t('auth.forgotPassword.loginLink')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  form: {
    width: '100%',
    gap: 20,
  },
  resetButton: {
    marginTop: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: 'auto',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
