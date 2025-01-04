import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type HealthStatus = 'excellent' | 'good' | 'fair' | 'poor';

const STATUS_CONFIG = {
  excellent: {
    icon: 'heart-pulse',
    color: '#4CAF50',
    text: 'Excellent',
    description: 'Your health metrics are optimal',
  },
  good: {
    icon: 'heart-pulse',
    color: '#2196F3',
    text: 'Good',
    description: 'Your health is in good condition',
  },
  fair: {
    icon: 'heart-pulse',
    color: '#FFC107',
    text: 'Fair',
    description: 'Some metrics need attention',
  },
  poor: {
    icon: 'heart-pulse',
    color: '#FF5252',
    text: 'Poor',
    description: 'Multiple metrics need attention',
  },
};

export const HealthStatusWidget: React.FC = () => {
  const { colors } = useTheme();
  const currentStatus: HealthStatus = 'good'; // This would come from your health service
  const config = STATUS_CONFIG[currentStatus];

  return (
    <View>
      {/* <Text style={[styles.sectionTitle, { color: colors.text }]}>Health Overview</Text> */}
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <View style={styles.header}>
          <View style={styles.statusContainer}>
            <Icon
              name={config.icon}
              size={32}
              color={config.color}
            />
            <View>
              <Text style={[styles.statusText, { color: config.color }]}>
                {config.text}
              </Text>
              <Text style={[styles.statusDescription, { color: colors.textSecondary }]}>
                {config.description}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.detailsButton, { borderColor: colors.border }]}
          >
            <Text style={[styles.detailsText, { color: colors.primary }]}>
              Details
            </Text>
            <Icon
              name="chevron-right"
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Heart Rate
            </Text>
            <View style={styles.metricValueContainer}>
              <Text style={[styles.metricValue, { color: colors.text }]}>72</Text>
              <Text style={[styles.metricUnit, { color: colors.textSecondary }]}>bpm</Text>
            </View>
          </View>

          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Blood Pressure
            </Text>
            <View style={styles.metricValueContainer}>
              <Text style={[styles.metricValue, { color: colors.text }]}>120/80</Text>
              <Text style={[styles.metricUnit, { color: colors.textSecondary }]}>mmHg</Text>
            </View>
          </View>

          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Sleep
            </Text>
            <View style={styles.metricValueContainer}>
              <Text style={[styles.metricValue, { color: colors.text }]}>7.5</Text>
              <Text style={[styles.metricUnit, { color: colors.textSecondary }]}>hrs</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  container: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '500',
  },
  statusDescription: {
    fontSize: 14,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  detailsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
    gap: 4,
  },
  metricLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  metricUnit: {
    fontSize: 12,
  },
});