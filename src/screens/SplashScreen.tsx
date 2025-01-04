import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/RootNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyledAppTitle } from '@components/StyledAppTitle';
import { StyledTagline } from '@components/StyledTagline';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export const SplashScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<SplashScreenNavigationProp>();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const selectedLanguage = await AsyncStorage.getItem('selectedLanguage');
        
        setTimeout(() => {
          if (!selectedLanguage) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'LanguageSelection' }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Welcome' }],
            });
          }
        }, 2500);
      } catch (error) {
        console.error('Error initializing app:', error);
        navigation.reset({
          index: 0,
          routes: [{ name: 'LanguageSelection' }],
        });
      }
    };

    initializeApp();
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        source={require('@assets/images/playstore.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <StyledAppTitle size="large" />
      <StyledTagline />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  logo: {
    width: '100%',
    height: 300,
    marginBottom: 40,
  },
  tagline: {
    fontSize: 18,
    marginTop: 8,
    fontWeight: '300',
  },
});
