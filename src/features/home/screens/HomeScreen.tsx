import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
import { Header } from '@/components/shared/Header';

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.widgetsSection}>
          <HealthStatusWidget />
          <StepsTrackerWidget />
        </View>

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

        <View style={styles.recentSection}>
          <RecentSymptoms />
      </View>
      </ScrollView>
    </View>
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
  },
  widgetsSection: {
    gap: 16,
    marginBottom: 24,
  },
  inputSection: {
    gap: 16,
    marginBottom: 24,
  },
  recentSection: {
    flex: 1,
  },
});

export default HomeScreen; 