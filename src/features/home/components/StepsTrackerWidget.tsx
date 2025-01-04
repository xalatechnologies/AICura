import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface StepsTrackerWidgetProps {
  title: string;
}

export const StepsTrackerWidget: React.FC<StepsTrackerWidgetProps> = ({ title }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const steps = 6500; // This would come from your health tracking service
  const goal = 10000;
  const progress = Math.min(steps / goal, 1);
  const calories = Math.round(steps * 0.04); // Rough estimate of calories burned
  const distance = (steps * 0.762) / 1000; // Average stride length of 0.762m to km

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Icon name="walk" size={24} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        </View>
        <TouchableOpacity
          style={[styles.detailsButton, { borderColor: colors.border }]}
        >
          <Text style={[styles.detailsText, { color: colors.primary }]}>
            {t('home.widgets.stepsTracker.history')}
          </Text>
          <Icon name="chevron-right" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.stepsContainer}>
        <View style={styles.stepsInfo}>
          <Text style={[styles.stepsCount, { color: colors.text }]}>
            {steps.toLocaleString()}
          </Text>
          <Text style={[styles.stepsLabel, { color: colors.textSecondary }]}>
            {t('home.widgets.stepsTracker.steps')}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <View 
            style={[
              styles.progressBar, 
              { backgroundColor: colors.border }
            ]}
          >
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: colors.primary,
                  width: `${progress * 100}%`,
                }
              ]} 
            />
          </View>
          <Text style={[styles.goalText, { color: colors.textSecondary }]}>
            {t('home.widgets.stepsTracker.goal', { goal: goal.toLocaleString() })}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.metricsContainer}>
        <View style={styles.metricItem}>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
            {t('home.widgets.stepsTracker.distance')}
          </Text>
          <View style={styles.metricValueContainer}>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {distance.toFixed(2)}
            </Text>
            <Text style={[styles.metricUnit, { color: colors.textSecondary }]}>
              {t('home.widgets.stepsTracker.km')}
            </Text>
          </View>
        </View>

        <View style={styles.metricItem}>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
            {t('home.widgets.stepsTracker.calories')}
          </Text>
          <View style={styles.metricValueContainer}>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {calories}
            </Text>
            <Text style={[styles.metricUnit, { color: colors.textSecondary }]}>
              {t('home.widgets.stepsTracker.kcal')}
            </Text>
          </View>
        </View>

        <View style={styles.metricItem}>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
            {t('home.widgets.stepsTracker.progress')}
          </Text>
          <View style={styles.metricValueContainer}>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {Math.round(progress * 100)}
            </Text>
            <Text style={[styles.metricUnit, { color: colors.textSecondary }]}>%</Text>
          </View>
        </View>
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
    shadowOffset: { width: 2, height: 4 },
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