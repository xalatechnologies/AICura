import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
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
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.inputSection}>
          <SymptomInput
            value={symptomText}
            onChangeText={setSymptomText}
            isRecording={isRecording}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            placeholder="Describe your symptoms..."
          />
          <StartAnalysisButton onPress={handleStartAnalysis} disabled={!symptomText.trim()} />
        </View>

        <View style={styles.recentSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Symptoms</Text>
          <RecentSymptoms />
        </View>

        <View style={styles.widgetsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Health Overview</Text>
          <HealthStatusWidget />
          <StepsTrackerWidget />
        </View>
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
  contentContainer: {
    padding: 16,
    gap: 24,
  },
  inputSection: {
    gap: 16,
  },
  recentSection: {
    gap: 12,
  },
  widgetsContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
});

export default HomeScreen; 