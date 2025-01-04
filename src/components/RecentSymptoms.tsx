import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SymptomRecord {
  id: string;
  symptom: string;
  severity: string;
  date: string;
  time: string;
}

// Mock data - replace with actual data from backend
const MOCK_SYMPTOMS: SymptomRecord[] = [
  {
    id: '1',
    symptom: 'Headache',
    severity: 'Moderate',
    date: 'Today',
    time: '2:30 PM',
  },
  {
    id: '2',
    symptom: 'Fatigue',
    severity: 'Mild',
    date: 'Yesterday',
    time: '9:15 AM',
  },
  {
    id: '3',
    symptom: 'Sore Throat',
    severity: 'Severe',
    date: 'Yesterday',
    time: '8:00 AM',
  },
  {
    id: '4',
    symptom: 'Cough',
    severity: 'Moderate',
    date: '2 days ago',
    time: '3:45 PM',
  },
  {
    id: '5',
    symptom: 'Fever',
    severity: 'Severe',
    date: '2 days ago',
    time: '2:00 PM',
  },
  {
    id: '6',
    symptom: 'Nausea',
    severity: 'Mild',
    date: '3 days ago',
    time: '11:30 AM',
  },
];

export const RecentSymptoms: React.FC = () => {
  const { colors } = useTheme();
  const [displayCount, setDisplayCount] = useState(3);
  const hasMore = displayCount < MOCK_SYMPTOMS.length;

  const handleShowMore = () => {
    setDisplayCount(prev => Math.min(prev + 3, MOCK_SYMPTOMS.length));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'mild':
        return '#4CAF50';
      case 'moderate':
        return '#FFC107';
      case 'severe':
        return '#F44336';
      default:
        return colors.text;
    }
  };

  return (
    <View style={styles.container}>
      {MOCK_SYMPTOMS.slice(0, displayCount).map((record) => (
        <TouchableOpacity
          key={record.id}
          style={[styles.card, { backgroundColor: colors.card }]}
          onPress={() => {/* Handle symptom details view */}}
        >
          <View style={styles.cardContent}>
            <View style={styles.mainInfo}>
              <Text style={[styles.symptomText, { color: colors.text }]}>
                {record.symptom}
              </Text>
              <Text
                style={[
                  styles.severityText,
                  { color: getSeverityColor(record.severity) },
                ]}
              >
                {record.severity}
              </Text>
            </View>
            <View style={styles.timeInfo}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={14}
                color={colors.textSecondary}
              />
              <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                {record.date} at {record.time}
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      ))}
      
      {hasMore && (
        <TouchableOpacity
          style={[styles.showMoreButton, { borderColor: colors.border }]}
          onPress={handleShowMore}
        >
          <Text style={[styles.showMoreText, { color: colors.primary }]}>
            Show More
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color={colors.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  symptomText: {
    fontSize: 16,
    fontWeight: '500',
  },
  severityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 