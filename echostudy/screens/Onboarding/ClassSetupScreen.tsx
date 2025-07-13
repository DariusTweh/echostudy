import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function ClassSetupScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { interests, tone_preference, study_goal } = route.params;

  const handleFinish = () => {
    // Save the onboarding data here or in the next screen
    navigation.reset({
  index: 0,
  routes: [{ name: 'MainApp' }],
});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Class Setup</Text>
      <Text style={styles.subLabel}>Want to start with your classes?</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.optionBox} onPress={() => {/* Handle syllabus upload */}}>
          <Icon name="file-text" size={24} color="#1E293B" />
          <Text style={styles.optionText}>Upload syllabus</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionBox} onPress={() => {/* Handle manual entry */}}>
          <Icon name="plus" size={24} color="#1E293B" />
          <Text style={styles.optionText}>Add manually</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.skipButton} onPress={handleFinish}>
        <Text style={styles.skipText}>Skip for now</Text>
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
