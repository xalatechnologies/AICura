import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/RootNavigator';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { supabase } from '@/lib/supabase';
import { StyledAppTitle } from '@components/StyledAppTitle';
import { Header } from '@home/components';

type SignupScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Signup'>;
};

export const SignupScreen = ({ navigation }: SignupScreenProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert(t('auth.signup.error'), t('auth.signup.emptyFields'));
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(t('auth.signup.error'), t('auth.signup.passwordMismatch'));
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      Alert.alert(
        t('auth.signup.success'),
        t('auth.signup.verificationSent'),
        [
          {
            text: t('common.ok'),
            onPress: () => navigation.replace('Login'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(t('auth.signup.error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header showBack hideGreeting />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <StyledAppTitle size="large" />
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {t('auth.signup.description')}
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            placeholder={t('auth.signup.emailPlaceholder')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="email"
          />

          <Input
            placeholder={t('auth.signup.passwordPlaceholder')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock"
          />

          <Input
            placeholder={t('auth.signup.confirmPasswordPlaceholder')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            icon="lock"
          />

          <Button
            title={t('auth.signup.signupButton')}
            onPress={handleSignup}
            loading={loading}
            style={styles.button}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            {t('auth.signup.alreadyHaveAccount')}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.footerLink, { color: colors.primary }]}>
              {t('auth.signup.loginLink')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  button: {
    width: '100%',
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
