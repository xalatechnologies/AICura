import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const HealthStatusWidget: React.FC = () => {
  const { colors } = useTheme();
  const status = 'Good'; // This would come from your health status service

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Icon name="heart-pulse" size={32} color={colors.primary} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Current Health Status</Text>
        <Text style={[styles.status, { color: colors.primary }]}>{status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  icon: {
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
  },
  status: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 4,
  },
}); 