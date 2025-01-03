import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import {
  LanguageSelectionScreen,
  OnboardingScreen,
  HomeScreen,
  AppointmentsScreen,
  ChatScreen,
  ProfileScreen,
} from '../screens';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthContextType } from '../contexts/AuthContext';
import { useAuth } from '../contexts/AuthContext';

export type RootStackParamList = {
  LanguageSelection: undefined;
  Onboarding: undefined;
  MainTabs: undefined;
  Home: undefined;
  Appointments: undefined;
  Chat: undefined;
  Profile: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  Welcome: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: { backgroundColor: colors.background },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t('navigation.home'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={AppointmentsScreen}
        options={{
          title: t('appointments'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: t('chat'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="chatbubbles" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: t('profile'),
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const RootNavigator = () => {
  const auth = useAuth();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(false);
  const [hasLanguage, setHasLanguage] = useState<boolean>(false);

  const checkStorageValues = async () => {
    try {
      const [onboarding, language] = await Promise.all([
        AsyncStorage.getItem('onboardingComplete'),
        AsyncStorage.getItem('userLanguage')
      ]);
      setOnboardingComplete(onboarding === 'true');
      setHasLanguage(!!language);
    } catch (error) {
      console.error('Error checking storage values:', error);
    }
  };

  useEffect(() => {
    checkStorageValues();
  }, [auth.session]); // Re-check when auth state changes

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasLanguage ? (
        <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
      ) : !auth.session || !onboardingComplete ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <Stack.Screen name="MainTabs" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
};
