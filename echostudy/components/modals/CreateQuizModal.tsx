
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const QUESTION_TYPES = [
  { label: 'MCQ', emoji: '🧠' },
  { label: 'Short Answer', emoji: '✍️' },
  { label: 'Matching', emoji: '🧩' },
];

const SOURCES = [
  { label: 'Deck' },
  { label: 'Notes' },
  { label: 'Upload PDF' },
  { label: 'Manual Topic' },
];

type CreateQuizModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreate: (quiz: {
    title: string;
    types: string[];
    source: string;
    numberOfQuestions: string;
    mode: 'exam' | 'practice';
  }) => void;
};

const CreateQuizModal = ({ visible, onClose, onCreate }: CreateQuizModalProps) => {
  const [title, setTitle] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState('');
  const [mode, setMode] = useState<'exam' | 'practice'>('practice');

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = () => {
    if (!title.trim() || !selectedSource || selectedTypes.length === 0) return;
    onCreate({
      title: title.trim(),
      types: selectedTypes,
      source: selectedSource,
      numberOfQuestions: questionCount,
      mode,
    });
    setTitle('');
    setSelectedTypes([]);
    setSelectedSource(null);
    setQuestionCount('');
    setMode('practice');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Create New Quiz</Text>

          <Text style={styles.label}>Title</Text>
          <TextInput
            placeholder="e.g. Nervous System Review"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <Text style={styles.label}>Question Types</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
            {QUESTION_TYPES.map((type) => (
              <TouchableOpacity
                key={type.label}
                style={[
                  styles.pill,
                  selectedTypes.includes(type.label) && styles.pillActive,
                ]}
                onPress={() => toggleType(type.label)}
              >
                <Text
                  style={[
                    styles.pillText,
                    selectedTypes.includes(type.label) && styles.pillTextActive,
                  ]}
                >
                  {type.emoji} {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Source</Text>
          <View style={styles.sourceGroup}>
            {SOURCES.map((src) => (
              <TouchableOpacity
                key={src.label}
                style={[
                  styles.sourceOption,
                  selectedSource === src.label && styles.sourceSelected,
                ]}
                onPress={() => setSelectedSource(src.label)}
              >
                <Text
                  style={[
                    styles.sourceText,
                    selectedSource === src.label && styles.sourceTextSelected,
                  ]}
                >
                  {src.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Number of Questions</Text>
          <TextInput
            keyboardType="numeric"
            placeholder="e.g. 10"
            value={questionCount}
            onChangeText={setQuestionCount}
            style={styles.input}
          />

          <Text style={styles.label}>Mode</Text>
          <View style={styles.row}>
            {['practice', 'exam'].map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => setMode(m as 'exam' | 'practice')}
                style={[
                  styles.modeButton,
                  mode === m && styles.modeActive,
                ]}
              >
                <Text
                  style={[
                    styles.modeText,
                    mode === m && styles.modeTextActive,
                  ]}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)} Mode
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.createButton} onPress={handleSubmit}>
              <Text style={styles.createText}>Generate Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#0F172A',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  pill: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  pillActive: {
    backgroundColor: '#2563EB',
  },
  pillText: {
    fontSize: 14,
    color: '#1F2937',
  },
  pillTextActive: {
    color: '#fff',
  },
  sourceGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 10,
  },
  sourceOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    marginRight: 10,
    marginTop: 6,
  },
  sourceSelected: {
    backgroundColor: '#2563EB',
  },
  sourceText: {
    fontSize: 14,
    color: '#1F2937',
  },
  sourceTextSelected: {
    color: '#fff',
  },
  modeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    marginRight: 10,
  },
  modeActive: {
    backgroundColor: '#2563EB',
  },
  modeText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  modeTextActive: {
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelText: {
    fontSize: 15,
    color: '#6B7280',
  },
  createButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
  },
  createText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default CreateQuizModal;
