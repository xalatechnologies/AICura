import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@contexts/AuthContext';
import { WelcomeScreen } from '@screens/auth/WelcomeScreen';
import { LoginScreen } from '@screens/auth/LoginScreen';
import { SignupScreen } from '@screens/auth/SignupScreen';
import { ForgotPasswordScreen } from '@screens/auth/ForgotPasswordScreen';
import { OnboardingScreen } from '@screens/OnboardingScreen';
import HomeScreen from '@screens/HomeScreen';
import { LoadingScreen } from '@screens/LoadingScreen';
import { LanguageSelectionScreen } from '@screens/LanguageSelectionScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  Onboarding: undefined;
  Home: undefined;
  LanguageSelection: undefined;
  MainTabs: undefined;
  Appointments: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { session, loading, user } = useAuth();
  const [isLanguageSelected, setIsLanguageSelected] = useState<boolean | null>(null);

  useEffect(() => {
    checkLanguageSelection();
  }, []);

  const checkLanguageSelection = async () => {
    try {
      const selectedLanguage = await AsyncStorage.getItem('selectedLanguage');
      setIsLanguageSelected(!!selectedLanguage);
    } catch (error) {
      setIsLanguageSelected(false);
    }
  };

  if (loading || isLanguageSelected === null) {
    return <LoadingScreen />;
  }

  if (!isLanguageSelected) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {session && user ? (
        user.user_metadata?.onboarded ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        )
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
