import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WelcomeScreen = () => {
  const { t } = useTranslation();
  const { theme, colors } = useAppTheme();
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Illustration/Logo */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/welcome-illustration.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Title and Description */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('auth.welcome.title')}
          </Text>
          <Text style={[styles.description, { color: colors.text }]}>
            {t('auth.welcome.description')}
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.loginButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={[styles.buttonText, { color: colors.background }]}>
              {t('auth.welcome.login')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.signupButton, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>
              {t('auth.welcome.signup')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Terms and Privacy */}
        <View style={styles.termsContainer}>
          <Text style={[styles.termsText, { color: colors.text }]}>
            {t('auth.welcome.terms')}{' '}
            <Text style={[styles.link, { color: colors.primary }]}>
              {t('auth.welcome.termsLink')}
            </Text>{' '}
            {t('auth.welcome.and')}{' '}
            <Text style={[styles.link, { color: colors.primary }]}>
              {t('auth.welcome.privacyLink')}
            </Text>
          </Text>
        </View>
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
    justifyContent: 'space-between',
  },
  imageContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.8,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButton: {
    marginBottom: 12,
  },
  signupButton: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  termsContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
  link: {
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;
