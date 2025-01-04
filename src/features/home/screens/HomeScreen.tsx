import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@theme/ThemeContext';
import { SymptomInput } from '@symptoms/components';
import { useSymptomAnalysis } from '@symptoms/hooks/useSymptomAnalysis';
import { useNavigation } from '@react-navigation/native';
import {
  StartAnalysisButton,
  HealthStatusWidget,
  StepsTrackerWidget,
  RecentSymptoms,
} from '../components';

export const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [symptomText, setSymptomText] = useState('');
  const {
    isRecording,
    startRecording,
    stopRecording,
  } = useSymptomAnalysis();

  const handleStartAnalysis = () => {
    if (symptomText.trim()) {
      navigation.navigate('SymptomAnalyzer', { initialSymptom: symptomText });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Health Widgets Section */}
        <View style={styles.widgetsSection}>
          <HealthStatusWidget />
          <StepsTrackerWidget />
        </View>

        {/* Symptom Input Section */}
        <View style={styles.inputSection}>
          <SymptomInput
            value={symptomText}
            onChangeText={setSymptomText}
            isRecording={isRecording}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            placeholder="Describe your symptoms..."
          />
          <StartAnalysisButton onPress={handleStartAnalysis} />
        </View>

        {/* Recent Symptoms Section */}
        <View style={styles.recentSection}>
          <RecentSymptoms />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 24,
  },
  widgetsSection: {
    gap: 16,
  },
  inputSection: {
    gap: 16,
    paddingVertical: 8,
  },
  recentSection: {
    flex: 1,
  },
});

export default HomeScreen; 