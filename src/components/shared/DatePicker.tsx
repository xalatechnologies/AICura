import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@/theme/ThemeContext';
import { format } from 'date-fns';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  placeholder: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  const { colors } = useTheme();

  const handleChange = (_: any, selectedDate?: Date) => {
    setShow(Platform.OS === 'ios');
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.input, { borderColor: colors.border }]}
        onPress={() => setShow(true)}
      >
        <Text style={[styles.text, { color: colors.text }]}>
          {value ? format(value, 'MM/dd/yyyy') : placeholder}
        </Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
  },
});

export default DatePicker; 