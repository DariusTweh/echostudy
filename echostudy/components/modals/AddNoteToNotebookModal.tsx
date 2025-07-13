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
import * as DocumentPicker from 'expo-document-picker';

const NOTE_TYPES = [
  { label: 'Concept', emoji: '🧠' },
  { label: 'Lab', emoji: '🔬' },
  { label: 'Summary', emoji: '✏️' },
  { label: 'Questions', emoji: '💬' },
];

type AddNoteToNotebookModalProps = {
  visible: boolean;
  notebookName: string;
  onClose: () => void;
  onCreate: (note: {
    title: string;
    type: string | null;
    file?: any;
    autoGenerate: boolean;
  }) => void;
  onManualCreate: (noteTitle: string, type: string | null) => void;
};

const AddNoteToNotebookModal = ({
  visible,
  notebookName,
  onClose,
  onCreate,
  onManualCreate,
}: AddNoteToNotebookModalProps) => {
  const [title, setTitle] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'application/vnd.ms-powerpoint'],
    });

    if (result?.assets?.length > 0) {
      onCreate({
        title,
        type: selectedType,
        file: result.assets[0],
        autoGenerate: true,
      });
      setTitle('');
      setSelectedType(null);
      onClose();
    }
  };

  const handleManual = () => {
    if (!title.trim()) return;
    onManualCreate(title.trim(), selectedType);
    setTitle('');
    setSelectedType(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Add New Note to {notebookName}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              placeholder="e.g. Chapter 5: Photosynthesis"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>

          <Text style={styles.inputLabel}>Note Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow}>
            {NOTE_TYPES.map((type) => (
              <TouchableOpacity
                key={type.label}
                style={[
                  styles.pill,
                  selectedType === type.label && styles.pillActive,
                ]}
                onPress={() =>
                  setSelectedType(type.label === selectedType ? null : type.label)
                }
              >
                <Text
                  style={[
                    styles.pillText,
                    selectedType === type.label && styles.pillTextActive,
                  ]}
                >
                  {type.emoji} {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.uploadCard} onPress={handleUpload}>
            <Text style={styles.uploadTitle}>📎 Upload File to Auto-Generate</Text>
            <Text style={styles.uploadSub}>AI will summarize and structure your note</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.manualLink} onPress={handleManual}>
            <Text style={styles.manualText}>✍️ Write Manually Instead</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#0F172A',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#0F172A',
    backgroundColor: '#F9FAFB',
  },
  pillRow: {
    flexDirection: 'row',
    marginBottom: 24,
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
    color: '#1F2937',
    fontSize: 14,
  },
  pillTextActive: {
    color: '#fff',
  },
  uploadCard: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0F172A',
  },
  uploadSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  manualLink: {
    marginBottom: 16,
    alignItems: 'center',
  },
  manualText: {
    fontSize: 15,
    color: '#2563EB',
    fontWeight: '500',
  },
  cancelText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 10,
  },
});

export default AddNoteToNotebookModal;
