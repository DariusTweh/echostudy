import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

const COLOR_OPTIONS = [
  '#D1FAE5', // green
  '#EDE9FE', // purple
  '#FEF3C7', // yellow
  '#DBEAFE', // blue
  '#FEE2E2', // red
];

const ICON_OPTIONS = ['📘', '📗', '📕', '🧠', '🔬', '✏️', '📖'];

type CreateNotebookModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreate: (notebook: { title: string; color: string; icon: string }) => void;
};

const CreateNotebookModal = ({ visible, onClose, onCreate }: CreateNotebookModalProps) => {
  const [title, setTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0]);

  const handleCreate = () => {
    if (!title.trim()) return;
    onCreate({ title: title.trim(), color: selectedColor, icon: selectedIcon });
    setTitle('');
    setSelectedColor(COLOR_OPTIONS[0]);
    setSelectedIcon(ICON_OPTIONS[0]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Create Notebook</Text>

          <TextInput
            placeholder="Notebook name"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <Text style={styles.label}>Choose Color:</Text>
          <View style={styles.colorRow}>
            {COLOR_OPTIONS.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedBorder,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>

          <Text style={styles.label}>Choose Icon:</Text>
          <FlatList
            data={ICON_OPTIONS}
            keyExtractor={(item) => item}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.iconBox,
                  selectedIcon === item && styles.selectedIcon,
                ]}
                onPress={() => setSelectedIcon(item)}
              >
                <Text style={styles.iconText}>{item}</Text>
              </TouchableOpacity>
            )}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
              <Text style={styles.createText}>Create</Text>
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
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#0F172A',
  },
  input: {
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
    color: '#111827',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  colorRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedBorder: {
    borderColor: '#2563EB',
  },
  iconBox: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 10,
  },
  selectedIcon: {
    backgroundColor: '#E0F2FE',
    borderColor: '#2563EB',
  },
  iconText: {
    fontSize: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelText: {
    color: '#6B7280',
    fontSize: 15,
    marginRight: 16,
  },
  createButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default CreateNotebookModal;
