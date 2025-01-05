import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Vibration } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeContext';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { Symptom } from '../../types';
import Icon from 'react-native-vector-icons/Ionicons';

interface SymptomDetailsStepProps {
  onDataChange?: (data: any) => void;
  symptoms?: Symptom[];
}

type Onset = 'hours' | 'days' | 'weeks' | 'months';
type Duration = 'constant' | 'intermittent';
type Trigger = 'movement' | 'rest' | 'food' | 'stress' | 'weather' | 'other';

export const SymptomDetailsStep: React.FC<SymptomDetailsStepProps> = ({
  onDataChange,
  symptoms = [],
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);
  const [onset, setOnset] = useState<Onset>('hours');
  const [severity, setSeverity] = useState(5);
  const [duration, setDuration] = useState<Duration>('constant');
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [sliderAnim] = useState(new Animated.Value(5));
  const [buttonScales] = useState({
    onset: new Animated.Value(1),
    duration: new Animated.Value(1),
    triggers: new Animated.Value(1),
  });

  useEffect(() => {
    Animated.spring(sliderAnim, {
      toValue: severity,
      tension: 40,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [severity]);

  const animateButton = (type: keyof typeof buttonScales, value: any) => {
    Animated.sequence([
      Animated.timing(buttonScales[type], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScales[type], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    Vibration.vibrate(50);

    switch (type) {
      case 'onset':
        setOnset(value as Onset);
        break;
      case 'duration':
        setDuration(value as Duration);
        break;
    }
    updateData();
  };

  const handleSeverityChange = (value: number) => {
    setSeverity(Math.round(value));
    updateData();
  };

  const handleTriggerToggle = (trigger: Trigger) => {
    Vibration.vibrate(50);
    setTriggers(prev => {
      const newTriggers = prev.includes(trigger)
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger];
      return newTriggers;
    });
    updateData();
  };

  const updateData = () => {
    if (selectedSymptom) {
      onDataChange?.({
        symptomDetails: {
          id: selectedSymptom.id,
          onset,
          severity,
          duration,
          triggers,
        },
      });
    }
  };

  const getSeverityColor = (value: number) => {
    if (value <= 3) return colors.success;
    if (value <= 6) return colors.warning;
    return colors.error;
  };

  const renderOnsetOptions = () => {
    const options: Onset[] = ['hours', 'days', 'weeks', 'months'];
    return (
      <View style={styles.optionsContainer}>
        {options.map(option => (
          <Animated.View
            key={option}
            style={{
              transform: [{ scale: buttonScales.onset }],
            }}
          >
            <TouchableOpacity
              style={[
                styles.optionButton,
                {
                  backgroundColor: onset === option ? colors.primary : colors.card,
                  borderWidth: 1,
                  borderColor: onset === option ? colors.primary : colors.border,
                },
              ]}
              onPress={() => animateButton('onset', option)}
            >
              <Icon
                name={onset === option ? 'checkmark-circle' : 'radio-button-off'}
                size={18}
                color={onset === option ? colors.textInverted : colors.text}
                style={styles.optionIcon}
              />
              <Text
                style={[
                  styles.optionText,
                  { color: onset === option ? colors.textInverted : colors.text },
                ]}
              >
                {t(`symptoms.onset.${option}`)}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    );
  };

  const renderDurationOptions = () => {
    const options: Duration[] = ['constant', 'intermittent'];
    return (
      <View style={styles.optionsContainer}>
        {options.map(option => (
          <Animated.View
            key={option}
            style={{
              transform: [{ scale: buttonScales.duration }],
            }}
          >
            <TouchableOpacity
              style={[
                styles.optionButton,
                {
                  backgroundColor: duration === option ? colors.primary : colors.card,
                  borderWidth: 1,
                  borderColor: duration === option ? colors.primary : colors.border,
                },
              ]}
              onPress={() => animateButton('duration', option)}
            >
              <Icon
                name={duration === option ? 'checkmark-circle' : 'radio-button-off'}
                size={18}
                color={duration === option ? colors.textInverted : colors.text}
                style={styles.optionIcon}
              />
              <Text
                style={[
                  styles.optionText,
                  { color: duration === option ? colors.textInverted : colors.text },
                ]}
              >
                {t(`symptoms.duration.${option}`)}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    );
  };

  const renderTriggerOptions = () => {
    const options: Trigger[] = ['movement', 'rest', 'food', 'stress', 'weather', 'other'];
    return (
      <View style={styles.optionsContainer}>
        {options.map(trigger => (
          <TouchableOpacity
            key={trigger}
            style={[
              styles.triggerButton,
              {
                backgroundColor: triggers.includes(trigger) ? colors.primary : colors.card,
                borderWidth: 1,
                borderColor: triggers.includes(trigger) ? colors.primary : colors.border,
              },
            ]}
            onPress={() => handleTriggerToggle(trigger)}
          >
            <Icon
              name={triggers.includes(trigger) ? 'checkmark-circle' : 'add-circle-outline'}
              size={18}
              color={triggers.includes(trigger) ? colors.textInverted : colors.text}
              style={styles.optionIcon}
            />
            <Text
              style={[
                styles.optionText,
                { color: triggers.includes(trigger) ? colors.textInverted : colors.text },
              ]}
            >
              {t(`symptoms.triggers.${trigger}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('symptoms.details.onset')}
        </Text>
        {renderOnsetOptions()}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('symptoms.details.severity')}
        </Text>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={severity}
            onValueChange={handleSeverityChange}
            minimumTrackTintColor={getSeverityColor(severity)}
            maximumTrackTintColor={colors.border}
            thumbTintColor={getSeverityColor(severity)}
          />
          <View style={styles.sliderLabels}>
            <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>
              {t('symptoms.severity.mild')}
            </Text>
            <Animated.View
              style={[
                styles.severityBadge,
                {
                  backgroundColor: getSeverityColor(severity),
                  transform: [
                    {
                      scale: sliderAnim.interpolate({
                        inputRange: [0, 5, 10],
                        outputRange: [0.8, 1, 1.2],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.severityValue}>{severity}</Text>
            </Animated.View>
            <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>
              {t('symptoms.severity.severe')}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('symptoms.details.duration')}
        </Text>
        {renderDurationOptions()}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('symptoms.details.triggers')}
        </Text>
        {renderTriggerOptions()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 100,
  },
  triggerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  optionIcon: {
    marginRight: 8,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sliderContainer: {
    paddingHorizontal: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -8,
  },
  sliderLabel: {
    fontSize: 12,
  },
  severityBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  severityValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 