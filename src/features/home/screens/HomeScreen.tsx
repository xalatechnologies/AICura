import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
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
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Health Widgets Section */}
        <HealthStatusWidget />
        <StepsTrackerWidget />

        {/* Symptom Input Section */}
        <SymptomInput
          value={symptomText}
          onChangeText={setSymptomText}
          isRecording={isRecording}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          placeholder="Describe your symptoms..."
        />
        <StartAnalysisButton onPress={handleStartAnalysis} />

        {/* Recent Symptoms Section */}
        <RecentSymptoms />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
});

export default HomeScreen; 