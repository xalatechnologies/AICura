import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { SymptomInput } from '@/features/symptoms/components/SymptomInput';
import { useSymptomAnalysis } from '@/features/symptoms/hooks/useSymptomAnalysis';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import {
  StartAnalysisButton,
  HealthStatusWidget,
  StepsTrackerWidget,
  RecentSymptoms,
} from '../components';
import { Header } from '@/components/shared/Header';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [symptomText, setSymptomText] = useState('');
  const {
    isRecording,
    startRecording,
    stopRecording,
  } = useSymptomAnalysis();

  const handleStartAnalysis = () => {
      navigation.navigate('Symptoms');
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
          {/* <SymptomInput
            value={symptomText}
            onChangeText={setSymptomText}
            isRecording={isRecording}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            placeholder="Describe your symptoms..."
          /> */}
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