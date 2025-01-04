import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SymptomEntry {
  id: string;
  description: string;
  date: string;
  severity: number;
}

const mockSymptoms: SymptomEntry[] = [
  {
    id: '1',
    description: 'Headache and mild fever',
    date: '2024-01-04',
    severity: 3,
  },
  {
    id: '2',
    description: 'Sore throat',
    date: '2024-01-03',
    severity: 2,
  },
  {
    id: '3',
    description: 'Back pain',
    date: '2024-01-02',
    severity: 4,
  },
];

export const RecentSymptoms: React.FC = () => {
  const { colors } = useTheme();

  const renderSymptomItem = ({ item }: { item: SymptomEntry }) => (
    <TouchableOpacity 
      style={[styles.symptomItem, { backgroundColor: colors.card }]}
      onPress={() => {/* Handle symptom selection */}}
    >
      <View style={styles.symptomContent}>
        <Text style={[styles.symptomText, { color: colors.text }]} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={[styles.dateText, { color: colors.text }]}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.severityContainer}>
        <Text style={[styles.severityText, { color: colors.primary }]}>
          {item.severity}/5
        </Text>
        <Icon name="chevron-right" size={24} color={colors.text} />
      </View>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Symptoms</Text>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockSymptoms}
        renderItem={renderSymptomItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={() => (
          <TouchableOpacity 
            style={[styles.showMoreButton, { borderColor: colors.border }]}
            onPress={() => {/* Handle show more */}}
          >
            <Text style={[styles.showMoreText, { color: colors.primary }]}>Show More</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  listContent: {
    gap: 8,
    paddingBottom: 16,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  symptomContent: {
    flex: 1,
    marginRight: 16,
  },
  symptomText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  severityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  severityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  showMoreButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 