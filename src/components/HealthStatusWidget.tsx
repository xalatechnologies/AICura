import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type HealthStatus = 'good' | 'monitor' | 'attention';

interface HealthStatusConfig {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  text: string;
  color: string;
  description: string;
}

const STATUS_CONFIG: Record<HealthStatus, HealthStatusConfig> = {
  good: {
    icon: 'check-circle',
    text: 'Feeling Good',
    color: '#4CAF50',
    description: 'No active symptoms or concerns',
  },
  monitor: {
    icon: 'alert-circle',
    text: 'Monitor Symptoms',
    color: '#FFC107',
    description: 'Mild symptoms present, keep tracking',
  },
  attention: {
    icon: 'alert-octagon',
    text: 'Needs Attention',
    color: '#F44336',
    description: 'Significant symptoms detected',
  },
};

interface HealthMetric {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
}

const HEALTH_METRICS: HealthMetric[] = [
  {
    icon: 'heart-pulse',
    label: 'Heart Rate',
    value: '72 bpm',
  },
  {
    icon: 'sleep',
    label: 'Sleep',
    value: '7.5 hrs',
  },
  {
    icon: 'run',
    label: 'Activity',
    value: 'Good',
  },
];

export const HealthStatusWidget: React.FC = () => {
  const { colors } = useTheme();
  // Mock status - replace with actual data
  const currentStatus: HealthStatus = 'good';
  const config = STATUS_CONFIG[currentStatus];

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <MaterialCommunityIcons
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
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.metricsContainer}>
        {HEALTH_METRICS.map((metric, index) => (
          <View key={index} style={styles.metricItem}>
            <MaterialCommunityIcons
              name={metric.icon}
              size={24}
              color={colors.primary}
            />
            <View>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                {metric.label}
              </Text>
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {metric.value}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
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
  metricValue: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
}); 