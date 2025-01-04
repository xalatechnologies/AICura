import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const StepsTrackerWidget: React.FC = () => {
  const { colors } = useTheme();
  const steps = 6500; // This would come from your health tracking service
  const goal = 10000;
  const progress = Math.min(steps / goal, 1);

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Icon name="walk" size={32} color={colors.primary} style={styles.icon} />
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Daily Steps</Text>
          <Text style={[styles.steps, { color: colors.primary }]}>{steps.toLocaleString()}</Text>
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
                styles.progress, 
                { 
                  backgroundColor: colors.primary,
                  width: `${progress * 100}%`,
                }
              ]} 
            />
          </View>
          <Text style={[styles.goal, { color: colors.text }]}>
            Goal: {goal.toLocaleString()}
          </Text>
        </View>
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
  contentContainer: {
    flex: 1,
    gap: 8,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
  },
  steps: {
    fontSize: 20,
    fontWeight: '600',
  },
  progressContainer: {
    gap: 4,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 2,
  },
  goal: {
    fontSize: 12,
    opacity: 0.5,
  },
}); 