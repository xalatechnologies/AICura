import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { useSymptomAnalysis } from '@features/symptoms/hooks/useSymptomAnalysis';
import { BodyMap, SymptomInput } from '@features/symptoms/components';
import { BODY_PARTS } from '@features/symptoms/constants';
import { Symptom } from '@features/symptoms/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const {
    isRecording,
    startRecording,
    stopRecording,
    symptoms,
    addSymptom,
    updateSymptomSeverity,
    updateSymptomFrequency,
    selectedBodyPart,
    selectBodyPart,
    messages,
    suggestions,
    followUpRounds,
    currentRound,
    submitSymptoms,
    selectFollowUpOption,
  } = useSymptomAnalysis();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Symptom Analyzer
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Select affected areas and describe your symptoms
        </Text>
      </View>

      <BodyMap
        bodyParts={BODY_PARTS}
        selectedPart={selectedBodyPart}
        onSelectPart={selectBodyPart}
        compact
      />

      <SymptomInput
        suggestions={suggestions}
        onAddSymptom={addSymptom}
        isRecording={isRecording}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
      />

      {symptoms.length > 0 && (
        <View style={styles.symptomsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Reported Symptoms
          </Text>
          {symptoms.map((symptom: Symptom, index: number) => (
            <View
              key={index}
              style={[styles.symptomCard, { backgroundColor: colors.card }]}
            >
              <View style={styles.symptomHeader}>
                <Text style={[styles.symptomName, { color: colors.text }]}>
                  {symptom.name}
                </Text>
                <View style={styles.symptomBadges}>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text style={styles.badgeText}>
                      Severity: {symptom.severity}/10
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text style={styles.badgeText}>
                      {symptom.frequency}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.analyzeButton, { backgroundColor: colors.primary }]}
            onPress={submitSymptoms}
          >
            <MaterialCommunityIcons
              name="stethoscope"
              size={24}
              color="#FFFFFF"
            />
            <Text style={styles.analyzeButtonText}>Analyze Symptoms</Text>
          </TouchableOpacity>
        </View>
      )}

      {messages.length > 0 && (
        <View style={styles.analysisContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Analysis Results
          </Text>
          {messages.map((message: string, index: number) => (
            <View
              key={index}
              style={[styles.messageCard, { backgroundColor: colors.card }]}
            >
              <Text style={[styles.messageText, { color: colors.text }]}>
                {message}
              </Text>
            </View>
          ))}
        </View>
      )}

      {followUpRounds.length > currentRound && (
        <View style={styles.followUpContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Follow-up Questions
          </Text>
          <View
            style={[styles.questionCard, { backgroundColor: colors.card }]}
          >
            <Text style={[styles.questionText, { color: colors.text }]}>
              {followUpRounds[currentRound].question}
            </Text>
            <View style={styles.optionsContainer}>
              {followUpRounds[currentRound].options.map((option: string) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor:
                        followUpRounds[currentRound].selectedOption === option
                          ? colors.primary
                          : colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => selectFollowUpOption(option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          followUpRounds[currentRound].selectedOption === option
                            ? '#FFFFFF'
                            : colors.text,
                      },
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  symptomsContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  symptomCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  symptomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  symptomName: {
    fontSize: 16,
    fontWeight: '500',
  },
  symptomBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  analyzeButton: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  analysisContainer: {
    marginTop: 24,
  },
  messageCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  followUpContainer: {
    marginTop: 24,
  },
  questionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default HomeScreen;

