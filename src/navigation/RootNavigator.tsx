import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '@screens/SplashScreen';
import { WelcomeScreen } from '@screens/auth/WelcomeScreen';
import { LoginScreen } from '@screens/auth/LoginScreen';
import { SignupScreen } from '@screens/auth/SignupScreen';
import { ForgotPasswordScreen } from '@screens/auth/ForgotPasswordScreen';
import { LanguageSelectionScreen } from '@screens/LanguageSelectionScreen';
import { MainTabs } from '@navigation/MainTabs';
import { useAuth } from '@context/AuthContext';

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  Onboarding: undefined;
  MainTabs: { screen?: 'Home' | 'Appointments' | 'Profile' | 'Settings' };
  LanguageSelection: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
      initialRouteName="Splash"
    >
      {isLoading ? (
        <Stack.Group screenOptions={{ gestureEnabled: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
        </Stack.Group>
      ) : !isAuthenticated ? (
        <Stack.Group>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};
