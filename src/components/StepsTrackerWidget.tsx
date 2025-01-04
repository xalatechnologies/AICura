import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DAILY_GOAL = 10000;

interface ActivityMetric {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  unit: string;
}

const ACTIVITY_METRICS: ActivityMetric[] = [
  {
    icon: 'fire',
    label: 'Calories',
    value: '320',
    unit: 'kcal',
  },
  {
    icon: 'map-marker-distance',
    label: 'Distance',
    value: '3.2',
    unit: 'km',
  },
  {
    icon: 'clock-time-four',
    label: 'Active Time',
    value: '45',
    unit: 'min',
  },
];

export const StepsTrackerWidget: React.FC = () => {
  const { colors } = useTheme();
  // Mock data - replace with actual data from health APIs
  const currentSteps = 4500;
  const progress = Math.min((currentSteps / DAILY_GOAL) * 100, 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons
            name="shoe-print"
            size={24}
            color={colors.primary}
          />
          <Text style={[styles.title, { color: colors.text }]}>Activity</Text>
        </View>
        <TouchableOpacity
          style={[styles.detailsButton, { borderColor: colors.border }]}
        >
          <Text style={[styles.detailsText, { color: colors.primary }]}>
            History
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.stepsContainer}>
        <View style={styles.stepsInfo}>
          <Text style={[styles.stepsCount, { color: colors.text }]}>
            {currentSteps.toLocaleString()}
          </Text>
          <Text style={[styles.stepsLabel, { color: colors.textSecondary }]}>
            steps today
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              {
                backgroundColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
          <Text style={[styles.goalText, { color: colors.textSecondary }]}>
            Goal: {DAILY_GOAL.toLocaleString()} steps
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.metricsContainer}>
        {ACTIVITY_METRICS.map((metric, index) => (
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
              <View style={styles.metricValueContainer}>
                <Text style={[styles.metricValue, { color: colors.text }]}>
                  {metric.value}
                </Text>
                <Text style={[styles.metricUnit, { color: colors.textSecondary }]}>
                  {metric.unit}
                </Text>
              </View>
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
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
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
  stepsContainer: {
    gap: 12,
  },
  stepsInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  stepsCount: {
    fontSize: 32,
    fontWeight: '700',
  },
  stepsLabel: {
    fontSize: 16,
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalText: {
    fontSize: 12,
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