import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const ClassInfoModal = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Class Info</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Instructor</Text>
            <Text style={styles.value}>Dr. Jackson Freeman</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>jfreeman@campus.edu</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Credits</Text>
            <Text style={styles.value}>3 Units</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Semester</Text>
            <Text style={styles.value}>Fall 2025</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Room</Text>
            <Text style={styles.value}>Science Hall, Room 212</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Syllabus</Text>
            <TouchableOpacity>
              <Text style={[styles.value, styles.link]}>Download PDF</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ClassInfoModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#1E3A8A',
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  link: {
    color: '#2563EB',
    textDecorationLine: 'underline',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#1E3A8A',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
