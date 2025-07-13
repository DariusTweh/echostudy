import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const goals = [
  'Ace my exams',
  'Prep for MCAT',
  'Get consistent',
  'Finish class notes weekly',
  'Boost GPA',
];

export default function StudyGoalScreen() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { interests, tone_preference } = route.params;

  const handleNext = () => {
    navigation.navigate('ClassSetupScreen', {
      interests,
      tone_preference,
      study_goal: selectedGoal,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Study Goal</Text>
      <Text style={styles.subLabel}>What's your main study goal right now?</Text>

      {goals.map(goal => (
        <TouchableOpacity
          key={goal}
          style={[styles.option, selectedGoal === goal && styles.selectedOption]}
          onPress={() => setSelectedGoal(goal)}
        >
          <Text style={[styles.optionText, selectedGoal === goal && styles.selectedText]}>
            {goal}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.nextButton} onPress={handleNext} disabled={!selectedGoal}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:80,
    padding: 24,
    backgroundColor: '#F9FAFB',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  subLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
  },
  option: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  selectedOption: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  nextButton: {
    marginTop: 30,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 40,
  },
  optionBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  skipButton: {
    marginTop: 'auto',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  skipText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
