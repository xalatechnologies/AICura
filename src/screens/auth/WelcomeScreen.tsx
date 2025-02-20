import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/RootNavigator';
import { StyledAppTitle } from '@components/StyledAppTitle';
import { StyledTagline } from '@components/StyledTagline';
import { ThemeHeader } from '@components/ThemeHeader';

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

export const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemeHeader showLanguage />

      <View style={styles.content}>
        <Image
          source={require('@assets/images/playstore.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.header}>
          <StyledAppTitle size="large" />
          <StyledTagline />
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.buttonText}>
              {t('auth.welcome.signup')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>
              {t('auth.welcome.login')}
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
    paddingTop: 60,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  buttons: {
    gap: 16,
  },
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  languageButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
