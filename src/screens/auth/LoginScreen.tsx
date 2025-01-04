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
import { useTheme } from '@theme/ThemeContext';
import { useAuth } from '@context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { supabase } from '@lib/supabase';
import { AuthError } from '@supabase/supabase-js';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { ThemeHeader } from '@components/ThemeHeader';
import { StyledAppTitle } from '@components/StyledAppTitle';
import { CustomColors } from '@styles/theme';

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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemeHeader showBack showLanguage />
      
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
    </SafeAreaView>
  );
};

const createStyles = (colors: CustomColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 20,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  form: {
    width: '100%',
    gap: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
  },
  button: {
    width: '100%',
    marginVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    gap: 4,
  },
  footerText: {
    fontSize: 14,
  },
  signupText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
