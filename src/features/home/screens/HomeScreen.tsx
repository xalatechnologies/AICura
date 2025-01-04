import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      <Header title={t('home.header.title')} />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.widgetsSection}>
          <HealthStatusWidget 
            title={t('home.widgets.healthStatus.title')}
          />
          <StepsTrackerWidget 
            title={t('home.widgets.stepsTracker.title')}
          />
        </View>

        <View style={styles.inputSection}>
          <StartAnalysisButton 
            onPress={handleStartAnalysis}
            text={t('home.actions.startAnalysis')}
          />
        </View>

        <View style={styles.recentSection}>
          <RecentSymptoms 
            title={t('home.recentSymptoms.title')}
            emptyText={t('home.recentSymptoms.empty')}
          />
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