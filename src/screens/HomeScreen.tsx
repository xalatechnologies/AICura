import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { useSymptomAnalysis } from '@hooks/useSymptomAnalysis';
import { BodyMap } from '@components/BodyMap';
import { SymptomSelector } from '@components/SymptomSelector';
import { SymptomInput } from '@components/SymptomInput';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/RootNavigator';
import type { MainTabsParamList } from '@navigation/MainTabs';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabsParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export const HomeScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {
    bodyParts,
    selectedBodyPart,
    selectBodyPart,
    symptoms,
    addSymptom,
    updateSymptom,
    removeSymptom,
    suggestions,
    isAnalyzing,
    submitSymptoms,
  } = useSymptomAnalysis();

  const handleSymptomInput = (text: string) => {
    // Add symptom with default severity and frequency
    addSymptom(text);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.title, { color: colors.text }]}>
            What symptoms are you experiencing?
          </Text>

          <SymptomInput
            onSubmit={handleSymptomInput}
            suggestions={suggestions}
            isLoading={isAnalyzing}
          />

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Or select the affected area on the body map
          </Text>

          <BodyMap
            bodyParts={bodyParts}
            selectedPart={selectedBodyPart}
            onSelectPart={selectBodyPart}
            compact
          />

          {symptoms.length > 0 && (
            <SymptomSelector
              suggestions={suggestions}
              selectedSymptoms={symptoms}
              onAddSymptom={addSymptom}
              onUpdateSymptom={updateSymptom}
              onRemoveSymptom={removeSymptom}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 24,
    marginBottom: 16,
  },
});

export default HomeScreen;

