import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

interface ChipInputProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export const ChipInput: React.FC<ChipInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState('');
  const { colors } = useTheme();

  const handleAddChip = () => {
    if (inputValue.trim()) {
      onChange([...value, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveChip = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={styles.chipContainer}>
        {value.map((chip, index) => (
          <View
            key={index}
            style={[styles.chip, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.chipText, { color: colors.textInverted }]}>{chip}</Text>
            <TouchableOpacity
              onPress={() => handleRemoveChip(index)}
              style={styles.removeButton}
            >
              <Icon name="close-circle" size={18} color={colors.textInverted} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={placeholder}
          placeholderTextColor={colors.text}
          onSubmitEditing={handleAddChip}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          onPress={handleAddChip}
          style={[styles.addButton, { backgroundColor: colors.primary }]}
        >
          <Icon name="add" size={20} color={colors.textInverted} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    margin: 4,
  },
  chipText: {
    marginRight: 4,
  },
  removeButton: {
    padding: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 