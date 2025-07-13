import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function AddClassModal({
  visible,
  onClose,
  onAddClass,
  newClassTitle,
  setNewClassTitle,
  newClassIcon,
  setNewClassIcon,
  newClassFocus,
  setNewClassFocus,
  handleBuildClassFromSyllabus,addAnotherClass,setAddAnotherClass,
  autoCloseModal, // NEW
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add New Class</Text>

          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={newClassTitle}
            onChangeText={setNewClassTitle}
            placeholder="Enter class title"
          />

          <Text style={styles.label}>Icon Name (Ionicons)</Text>
          <TextInput
            style={styles.input}
            value={newClassIcon}
            onChangeText={setNewClassIcon}
            placeholder="e.g. book-outline"
          />

          <Text style={styles.label}>Focus Topic</Text>
          <TextInput
            style={styles.input}
            value={newClassFocus}
            onChangeText={setNewClassFocus}
            placeholder="Enter focus topic"
          />

       <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <TouchableOpacity
            onPress={() => setAddAnotherClass(prev => !prev)}
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: '#94A3B8',
              marginRight: 8,
              backgroundColor: addAnotherClass ? '#2563EB' : 'transparent',
            }}
          />
          <Text style={{ color: '#334155', fontSize: 14 }}>Add another class after this</Text>
        </View>
          <TouchableOpacity
            style={styles.syllabusButton}
            onPress={async () => {
              const success = await handleBuildClassFromSyllabus();
              if (success && autoCloseModal) onClose();
            }}
          >
            <Text style={styles.syllabusButtonText}>📄 Upload Syllabus PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={onAddClass}>
            <Text style={styles.addButtonText}>Add Class</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  syllabusButton: {
    backgroundColor: '#E0F2FE',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  syllabusButtonText: {
    color: '#0369A1',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelButton: {
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 14,
  },
  syllabusUploadContainer: {
    marginBottom: 20,
  },
});
