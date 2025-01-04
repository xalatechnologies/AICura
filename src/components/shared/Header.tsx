import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  actionButton?: {
    icon: string;
    onPress: () => void;
  };
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
}

export const Header: React.FC<HeaderProps> = ({ 
  title,
  showBack = false, 
  onBack,
  actionButton,
  rightAction 
}) => {
  const { colors, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  const handleLanguagePress = () => {
    navigation.navigate('LanguageSelection');
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
          {showBack && (
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={handleBack}
            >
              <Icon name="arrow-left" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
          {actionButton && (
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={actionButton.onPress}
            >
              <Icon name={actionButton.icon} size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
          {title && (
            <Text style={[styles.title, { color: colors.text }]}>
              {title}
            </Text>
          )}
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={handleLanguagePress}
          >
            <Icon name="web" size={24} color={colors.primary} />
          </TouchableOpacity>
          
          {rightAction ? (
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={rightAction.onPress}
            >
              <Icon name={rightAction.icon} size={24} color={colors.primary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={toggleTheme}
            >
              <Icon name="theme-light-dark" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightSection: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
}); 