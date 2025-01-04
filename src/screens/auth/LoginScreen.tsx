import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@theme/ThemeContext';
import { useAuth } from '@context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthError } from '@supabase/supabase-js';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { StyledAppTitle } from '@components/StyledAppTitle';
import { Header } from '@home/components';

type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  Signup: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

type LoginScreenProps = {
  navigation: LoginScreenNavigationProp;
};

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('auth.login.error'), t('auth.login.emptyFields'));
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      const authError = error as AuthError;
      Alert.alert(t('auth.login.error'), authError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header showBack hideGreeting />
      
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <StyledAppTitle size="large" />
          <Text style={[styles.description, { color: colors.textSecondary }]}>
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
            style={{ width: '100%' }}
          />

          <Input
            placeholder={t('auth.login.passwordPlaceholder')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock"
            style={{ width: '100%' }}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPassword}
          >
            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
              {t('auth.login.forgotPassword')}
            </Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <Button
              title={t('auth.login.loginButton')}
              onPress={handleLogin}
              loading={loading}
              style={styles.button}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            {t('auth.login.noAccount')}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={[styles.signupText, { color: colors.primary }]}>
              {t('auth.login.signupLink')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
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
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 8,
  },
  button: {
    width: '100%',
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
  signupText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
