import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Calendar, MessageCircle, User, Moon } from 'react-native-feather';
import { TouchableOpacity } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../styles/theme';

export type RootStackParamList = {
  Home: undefined;
  Appointments: undefined;
  Chat: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { theme, toggleTheme } = useTheme();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  const screenOptions = {
    headerRight: () => (
      <TouchableOpacity 
        onPress={toggleTheme} 
        style={{ 
          padding: 8, 
          marginRight: 8,
          borderRadius: 20,
        }}
      >
        <Moon stroke={currentTheme.colors.text} width={24} height={24} />
      </TouchableOpacity>
    ),
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <Home stroke={color} width={size} height={size} />;
          } else if (route.name === 'Appointments') {
            return <Calendar stroke={color} width={size} height={size} />;
          } else if (route.name === 'Chat') {
            return <MessageCircle stroke={color} width={size} height={size} />;
          } else if (route.name === 'Profile') {
            return <User stroke={color} width={size} height={size} />;
          }
        },
        tabBarActiveTintColor: currentTheme.colors.primary,
        tabBarInactiveTintColor: `${currentTheme.colors.text}80`,
        tabBarStyle: {
          backgroundColor: currentTheme.colors.card,
          borderTopColor: currentTheme.colors.border,
        },
        headerStyle: {
          backgroundColor: currentTheme.colors.card,
        },
        headerTintColor: currentTheme.colors.text,
        ...screenOptions,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          title: 'HealthCare AI'
        }}
      />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
