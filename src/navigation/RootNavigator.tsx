import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@context/ThemeContext';
import { lightTheme, darkTheme } from '@styles/theme';
import HomeScreen from '@screens/HomeScreen';
import ChatScreen from '@screens/ChatScreen';
import MedicalJournalScreen from '@screens/MedicalJournalScreen';
import AppointmentsScreen from '@screens/AppointmentsScreen';
import ProfileScreen from '@screens/ProfileScreen';
import { Home, MessageCircle, Book, Calendar, User } from 'react-native-feather';

const Tab = createBottomTabNavigator();

const RootNavigator = () => {
  const { theme } = useTheme();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let Icon;
          switch (route.name) {
            case 'Home':
              Icon = Home;
              break;
            case 'Chat':
              Icon = MessageCircle;
              break;
            case 'Medical Journal':
              Icon = Book;
              break;
            case 'Appointments':
              Icon = Calendar;
              break;
            case 'Profile':
              Icon = User;
              break;
            default:
              Icon = Home;
          }
          return <Icon stroke={color} width={size} height={size} />;
        },
        tabBarActiveTintColor: currentTheme.colors.primary,
        tabBarInactiveTintColor: currentTheme.colors.text,
        tabBarStyle: {
          backgroundColor: currentTheme.colors.card,
        },
        headerStyle: {
          backgroundColor: currentTheme.colors.card,
        },
        headerTintColor: currentTheme.colors.text,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Medical Journal" component={MedicalJournalScreen} />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default RootNavigator;
