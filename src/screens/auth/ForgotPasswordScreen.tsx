import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@context/ThemeContext';
import { useAuth } from '@context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/types';
import { supabase } from '@lib/supabase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ForgotPasswordScreen = () => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', t('auth.errors.emailRequired'));
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'myapp://reset-password',
      });

      if (error) throw error;

      setEmailSent(true);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('auth.forgotPassword.title')}
          </Text>
          <Text style={[styles.description, { color: colors.text }]}>
            {t('auth.forgotPassword.description')}
          </Text>
        </View>

        {emailSent ? (
          <View style={styles.successContainer}>
            <Icon name="email-check" size={64} color={colors.primary} />
            <Text style={[styles.successTitle, { color: colors.text }]}>
              {t('auth.forgotPassword.emailSent')}
            </Text>
            <Text style={[styles.successDescription, { color: colors.text }]}>
              {t('auth.forgotPassword.checkEmail')}
            </Text>
          </View>
        ) : (
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Icon name="email-outline" size={20} color={colors.text} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                placeholder={t('auth.forgotPassword.emailPlaceholder')}
                placeholderTextColor={colors.text + '80'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Send Reset Link Button */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <Text style={[styles.buttonText, { color: colors.text }]}>
                  {t('auth.forgotPassword.sendButton')}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Back to Login */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Icon name="arrow-left" size={20} color={colors.text} />
          <Text style={[styles.backButtonText, { color: colors.text }]}>
            {t('auth.forgotPassword.backToLogin')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    opacity: 0.8,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  successDescription: {
    fontSize: 16,
    opacity: 0.8,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  backButtonText: {
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ForgotPasswordScreen;
