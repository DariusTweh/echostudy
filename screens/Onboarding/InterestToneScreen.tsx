import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Swap for lucide if using that
import { useNavigation } from '@react-navigation/native';

const tones = [
  { id: 'hard', label: 'Hard Coaching', icon: 'target' },
  { id: 'supportive', label: 'Supportive', icon: 'handshake' },
  { id: 'playful', label: 'Playful', icon: 'smile' },
  { id: 'academic', label: 'Academic', icon: 'book-open' },
];

export default function InterestToneScreen() {
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');
  const [selectedTone, setSelectedTone] = useState<string | null>(null);
  const navigation = useNavigation();

  const addInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput('');
    }
  };

  const removeInterest = (item: string) => {
    setInterests(interests.filter(i => i !== item));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Interests & Tone Calibration</Text>

      <Text style={styles.label}>Your interests</Text>
      <Text style={styles.subLabel}>Tell us what you like, such as movies, topics, or activities</Text>

      <TextInput
        style={styles.input}
        placeholder="Add an interest"
        value={interestInput}
        onChangeText={setInterestInput}
        onSubmitEditing={addInterest}
        returnKeyType="done"
      />

      <View style={styles.interestWrap}>
        {interests.map((item, index) => (
          <TouchableOpacity key={index} style={styles.interestChip} onLongPress={() => removeInterest(item)}>
            <Text style={styles.interestText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Preferred tone</Text>
      <Text style={styles.subLabel}>Choose the style of responses you prefer</Text>

      <View style={styles.toneWrap}>
        {tones.map(tone => (
          <TouchableOpacity
            key={tone.id}
            style={[styles.toneButton, selectedTone === tone.id && styles.toneSelected]}
            onPress={() => setSelectedTone(tone.id)}
          >
            <Icon name={tone.icon} size={18} color={selectedTone === tone.id ? '#fff' : '#1E293B'} />
            <Text style={[styles.toneText, selectedTone === tone.id && styles.toneTextSelected]}>{tone.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() =>
          navigation.navigate('StudyGoalScreen', {
            interests,
            tone_preference: selectedTone,
          })
        }
      >
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  subLabel: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  interestWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  interestChip: {
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
    marginTop: 6,
  },
  interestText: {
    fontSize: 14,
    color: '#1E293B',
  },
  toneWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
  },
  toneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  toneSelected: {
    backgroundColor: '#1E40AF',
  },
  toneText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
  toneTextSelected: {
    color: '#fff',
  },
  nextButton: {
    marginTop: 40,
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
});
