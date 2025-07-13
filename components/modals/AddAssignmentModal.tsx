import React, {useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';

export default function AddAssignmentModal({
  visible,
  onClose,
  onAddAssignment,
  newAssignmentTitle,
  setNewAssignmentTitle,
  newAssignmentDueDate,
  setNewAssignmentDueDate,
  newAssignmentStatus,
  setNewAssignmentStatus,
  newAssignmentType,
  setNewAssignmentType,
  newAssignmentPriority,
  setNewAssignmentPriority,
  keepAdding,
  setKeepAdding,
 
}) {
  const statusOptions = ['Not Started', 'In Progress', 'Done'];
  const typeOptions = ['Lab', 'Lecture Notes', 'Exam', 'Quiz', 'Project'];
  const priorityOptions = ['High', 'Medium', 'Low'];

  const renderOptionButtons = (options, selectedValue, setValue) => {
    return (
      <View style={styles.optionRow}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              selectedValue === option && styles.optionButtonSelected,
            ]}
            onPress={() => setValue(option)}
          >
            <Text
              style={[
                styles.optionButtonText,
                selectedValue === option && styles.optionButtonTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };


  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Assignment</Text>

          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={newAssignmentTitle}
            onChangeText={setNewAssignmentTitle}
            placeholder="Enter assignment title"
          />

          <View style={{ marginBottom: 16 }} />

          <Text style={styles.label}>Due Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            value={newAssignmentDueDate}
            onChangeText={setNewAssignmentDueDate}
            placeholder="e.g. 2025-06-15"
          />

          <Text style={styles.label}>Status</Text>
          {renderOptionButtons(statusOptions, newAssignmentStatus, setNewAssignmentStatus)}

          <Text style={styles.label}>Assignment Type</Text>
          {renderOptionButtons(typeOptions, newAssignmentType, setNewAssignmentType)}

          <Text style={styles.label}>Priority</Text>
          {renderOptionButtons(priorityOptions, newAssignmentPriority, setNewAssignmentPriority)}

          <View style={styles.toggleRow}>
            <Text style={styles.label}>Keep Adding More</Text>
            <Switch
              value={keepAdding}
              onValueChange={setKeepAdding}
              trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
              thumbColor={keepAdding ? '#FFFFFF' : '#F1F5F9'}
            />
          </View>

          <TouchableOpacity style={styles.addButton} onPress={onAddAssignment}>
        <Text style={styles.addButtonText}>Add Assignment</Text>
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
    width: '85%',
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
    marginBottom: 8,
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
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  optionButtonText: {
    color: '#334155',
    fontWeight: '600',
    fontSize: 14,
  },
  optionButtonTextSelected: {
    color: '#FFFFFF',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
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
});
