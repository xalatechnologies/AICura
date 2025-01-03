import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/RootNavigator';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { useAuth } from '@contexts/AuthContext';
import { LanguageSelector } from '@components/LanguageSelector';
import Icon from 'react-native-vector-icons/MaterialIcons';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signIn(email, password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <TouchableOpacity 
        style={styles.languageButton}
        onPress={() => setShowLanguageSelector(!showLanguageSelector)}
      >
        <Icon name="language" size={24} color={colors.primary} />
      </TouchableOpacity>

      {showLanguageSelector && (
        <View style={[styles.languageSelectorContainer, { backgroundColor: colors.card }]} >
          <LanguageSelector 
            onLanguageChange={() => setShowLanguageSelector(false)}
          />
        </View>
      )}

      <View style={styles.content}>
      <Image
          source={require('@assets/images/playstore.png')}
          style={styles.image}
          resizeMode="contain"
        />

    
      <View style={styles.header}>
    
        <Text style={[styles.title, { color: colors.text }]}>
          {t('auth.login.title')}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('auth.login.description')}
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          placeholder={t('auth.login.emailPlaceholder')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          icon="email"
        />

        <Input
          placeholder={t('auth.login.passwordPlaceholder')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          icon="lock"
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.forgotPassword}
        >
          <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
            {t('auth.login.forgotPassword')}
          </Text>
        </TouchableOpacity>

        <Button
          title={t('auth.login.loginButton')}
          onPress={handleLogin}
          style={styles.button}
          loading={loading}
        />

        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.textSecondary }]}>
            {t('auth.login.or')}
          </Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        <View style={styles.socialButtons}>
          <TouchableOpacity 
            style={[styles.socialButton, { backgroundColor: colors.card }]}
            onPress={() => {}}
          >
            <Icon name="google" size={24} color="#DB4437" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.socialButton, { backgroundColor: colors.card }]}
            onPress={() => {}}
          >
            <Icon name="facebook" size={24} color="#4267B2" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.socialButton, { backgroundColor: colors.card }]}
            onPress={() => {}}
          >
            <Icon name="apple" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            {t('auth.login.noAccount')}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={[styles.footerLink, { color: colors.primary }]}>
              {t('auth.login.signupLink')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
    </ScrollView>
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
    alignItems: 'center',
  },
  contentContainer: {
    paddingTop: 40,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  image: {
    width: '80%',
    height: 150,
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  languageButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  languageSelectorContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: '80%',
    maxWidth: 300,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 2,
  },
  button: {
    marginTop: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
