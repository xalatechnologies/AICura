import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  hideGreeting?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showBack = false, onBack, hideGreeting = false }) => {
  const { colors, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <LinearGradient
      colors={[colors.card, colors.background]}
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          shadowColor: '#000',
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {showBack ? (
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={handleBack}
            >
              <Icon name="arrow-left" size={24} color={colors.primary} />
            </TouchableOpacity>
          ) : !hideGreeting && (
            <Text style={[styles.greeting, { color: colors.text }]}>
              Hi, John!
            </Text>
          )}
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="web" size={24} color={colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={toggleTheme}
          >
            <Icon 
              name="theme-light-dark" 
              size={24} 
              color={colors.primary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
}); 