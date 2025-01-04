import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { useSymptomAnalysis } from '@hooks/useSymptomAnalysis';
import { BodyMap } from '@components/BodyMap';
import { SymptomSelector } from '@components/SymptomSelector';
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

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Select the affected area on the body map
          </Text>

          <BodyMap
            bodyParts={bodyParts}
            selectedPart={selectedBodyPart}
            onSelectPart={selectBodyPart}
          />

          <SymptomSelector
            suggestions={suggestions}
            selectedSymptoms={symptoms}
            onAddSymptom={addSymptom}
            onUpdateSymptom={updateSymptom}
            onRemoveSymptom={removeSymptom}
          />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.analyzeButton,
              {
                backgroundColor: symptoms.length > 0 ? colors.primary : colors.border,
                opacity: isAnalyzing ? 0.7 : 1,
              },
            ]}
            onPress={submitSymptoms}
            disabled={symptoms.length === 0 || isAnalyzing}
          >
            <Text style={styles.buttonText}>
              {isAnalyzing ? 'Analyzing...' : 'Analyze Symptoms'}
            </Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  analyzeButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;

