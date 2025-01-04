import React from 'react';
import { FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@theme/ThemeContext';

interface SuggestionsListProps {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({
  suggestions,
  onSelectSuggestion,
}) => {
  const { colors } = useTheme();

  return (
    <FlatList
      data={suggestions}
      keyExtractor={(item) => item}
      style={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onSelectSuggestion(item)}
          style={[styles.item, { borderColor: colors.border }]}
          accessibilityLabel={`Select ${item}`}
        >
          <Text style={{ color: colors.text }}>{item}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default SuggestionsList;

const styles = StyleSheet.create({
  list: {
    maxHeight: 150,
    marginBottom: 8,
  },
  item: {
    padding: 8,
    borderBottomWidth: 1,
  },
}); 