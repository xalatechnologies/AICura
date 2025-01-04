import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SymptomEntry {
  id: string;
  description: string;
  date: string;
  severity: number;
  status?: 'pending' | 'analyzed' | 'critical';
}

const mockSymptoms: SymptomEntry[] = [
  {
    id: '1',
    description: 'Headache and mild fever',
    date: '2024-01-04',
    severity: 3,
    status: 'analyzed',
  },
  {
    id: '2',
    description: 'Sore throat with difficulty swallowing',
    date: '2024-01-03',
    severity: 2,
    status: 'critical',
  },
  {
    id: '3',
    description: 'Lower back pain after exercise',
    date: '2024-01-02',
    severity: 4,
    status: 'pending',
  },
];

const STATUS_CONFIG = {
  pending: {
    icon: 'clock-outline',
    color: '#FFC107',
    label: 'Pending Analysis',
  },
  analyzed: {
    icon: 'check-circle-outline',
    color: '#4CAF50',
    label: 'Analysis Complete',
  },
  critical: {
    icon: 'alert-circle-outline',
    color: '#FF5252',
    label: 'Needs Attention',
  },
};

export const RecentSymptoms: React.FC = () => {
  const { colors } = useTheme();

  const handleEdit = (id: string) => {
    // Handle edit action
    console.log('Edit symptom:', id);
  };

  const handleDelete = (id: string) => {
    // Handle delete action
    console.log('Delete symptom:', id);
  };

  const handleShowDetails = (id: string) => {
    // Handle show details action
    console.log('Show details for symptom:', id);
  };

  const handleLoadMore = () => {
    // Handle load more action
    console.log('Load more symptoms');
  };

  const renderSymptomItem = (item: SymptomEntry) => {
    const statusConfig = STATUS_CONFIG[item.status || 'pending'];

    return (
      <View 
        key={item.id}
        style={[styles.symptomCard, { backgroundColor: colors.card }]}
      >
        <TouchableOpacity 
          style={styles.cardContent}
          onPress={() => handleShowDetails(item.id)}
        >
          <View style={styles.symptomHeader}>
            <View style={styles.statusContainer}>
              <Icon 
                name={statusConfig.icon} 
                size={20} 
                color={statusConfig.color} 
              />
              <Text style={[styles.statusText, { color: statusConfig.color }]}>
                {statusConfig.label}
              </Text>
            </View>
            <Text style={[styles.dateText, { color: colors.textSecondary }]}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>

          <Text 
            style={[styles.descriptionText, { color: colors.text }]} 
            numberOfLines={2}
          >
            {item.description}
          </Text>

          <View style={styles.severityContainer}>
            <Text style={[styles.severityLabel, { color: colors.textSecondary }]}>
              Severity:
            </Text>
            <View style={styles.severityBadge}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Icon
                  key={index}
                  name={index < item.severity ? 'circle' : 'circle-outline'}
                  size={12}
                  color={index < item.severity ? colors.primary : colors.textSecondary}
                  style={styles.severityDot}
                />
              ))}
            </View>
          </View>
        </TouchableOpacity>

        <View style={[styles.cardActions, { borderTopColor: colors.border }]}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleEdit(item.id)}
          >
            <Icon name="pencil" size={20} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.primary }]}>Edit</Text>
          </TouchableOpacity>

          <View style={[styles.actionDivider, { backgroundColor: colors.border }]} />

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDelete(item.id)}
          >
            <Icon name="delete" size={20} color={colors.error} />
            <Text style={[styles.actionText, { color: colors.error }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Symptoms</Text>
      <View style={styles.listContent}>
        {mockSymptoms.map(renderSymptomItem)}
        <TouchableOpacity 
          style={[styles.loadMoreButton, { borderColor: colors.border }]}
          onPress={handleLoadMore}
        >
          <Text style={[styles.loadMoreText, { color: colors.primary }]}>Show More</Text>
          <Icon name="chevron-down" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
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
    gap: 12,
    paddingBottom: 16,
  },
  symptomCard: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    padding: 16,
  },
  symptomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  severityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  severityLabel: {
    fontSize: 12,
  },
  severityBadge: {
    flexDirection: 'row',
    gap: 2,
  },
  severityDot: {
    marginHorizontal: 1,
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    height: 48,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionDivider: {
    width: 1,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
    gap: 4,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 