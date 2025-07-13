import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

type AddNoteModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (type: 'notebook' | 'quick' | 'upload' | 'ai') => void;
};

const AddNoteModal = ({ visible, onClose, onSelect }: AddNoteModalProps) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>New Note Action</Text>

          <TouchableOpacity style={styles.option} onPress={() => onSelect('notebook')}>
            <Ionicons name="book" size={24} color="#2563EB" style={styles.icon} />
            <Text style={styles.optionText}>Create New Notebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => onSelect('quick')}>
            <MaterialCommunityIcons name="lightning-bolt" size={24} color="#F59E0B" style={styles.icon} />
            <Text style={styles.optionText}>Quick Note</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => onSelect('upload')}>
            <Ionicons name="cloud-upload-outline" size={24} color="#10B981" style={styles.icon} />
            <Text style={styles.optionText}>Upload File to Generate Note</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => onSelect('ai')}>
            <FontAwesome5 name="brain" size={22} color="#7C3AED" style={styles.icon} />
            <Text style={styles.optionText}>Generate AI Note</Text>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  icon: {
    marginRight: 12,
    width: 28,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  cancelText: {
    fontSize: 16,
    color: '#2563EB',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AddNoteModal;
