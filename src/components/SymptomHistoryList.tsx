import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SymptomHistoryItem {
  id: string;
  symptom: string;
  severity: string;
  timestamp: string;
}

// Mock data - replace with actual data from backend
const mockHistory: SymptomHistoryItem[] = [
  {
    id: '1',
    symptom: 'Headache',
    severity: 'Moderate',
    timestamp: 'Oct 10, 2023, 3:00 PM',
  },
  {
    id: '2',
    symptom: 'Abdominal Pain',
    severity: 'Severe',
    timestamp: 'Oct 9, 2023, 2:30 PM',
  },
  {
    id: '3',
    symptom: 'Fatigue',
    severity: 'Mild',
    timestamp: 'Oct 8, 2023, 10:00 AM',
  },
];

export const SymptomHistoryList: React.FC = () => {
  const { colors } = useTheme();

  const handleDelete = (id: string) => {
    // Implement delete functionality
    console.log('Delete item:', id);
  };

  const handleEdit = (id: string) => {
    // Implement edit functionality
    console.log('Edit item:', id);
  };

  const handleExpand = (id: string) => {
    // Implement expand functionality
    console.log('Expand item:', id);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Recent Symptoms</Text>
      {mockHistory.map((item) => (
        <View
          key={item.id}
          style={[styles.card, { backgroundColor: colors.card }]}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.symptomName, { color: colors.text }]}>
              {item.symptom}
            </Text>
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => handleEdit(item.id)}
                style={styles.actionButton}
              >
                <MaterialCommunityIcons
                  name="pencil"
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={styles.actionButton}
              >
                <MaterialCommunityIcons
                  name="delete"
                  size={20}
                  color={colors.error}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                {item.timestamp}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="thermometer"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Severity: {item.severity}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.expandButton, { borderTopColor: colors.border }]}
            onPress={() => handleExpand(item.id)}
          >
            <Text style={[styles.expandText, { color: colors.primary }]}>
              View Details
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  symptomName: {
    fontSize: 16,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderTopWidth: 1,
  },
  expandText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 