import React, { useState , useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

type QuickNoteModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (text: string, id?: string) => void;
  note?: { id: string; text: string }; // allow editing
};

const QuickNoteModal = ({ visible, onClose, onSave, note, }: QuickNoteModalProps) => {
  const [text, setText] = useState(note?.text || '');

  useEffect(() => {
  setText(note?.text || '');
}, [note]); 

  const handleSave = () => {
    if (text.trim()) {
      onSave(text, note?.id);

      setText('');
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Quick Note</Text>
          <TextInput
            style={styles.input}
            placeholder="Type your note here..."
            multiline
            value={text}
            onChangeText={setText}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    color: '#0F172A',
  },
  input: {
    minHeight: 100,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#111827',
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelButton: {
    marginRight: 12,
  },
  cancelText: {
    color: '#6B7280',
    fontSize: 15,
  },
  saveButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default QuickNoteModal;