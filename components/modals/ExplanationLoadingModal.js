// components/ui/ExplanationModal.js
import React from 'react';
import { Modal, View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';

export default function ExplanationModal({ visible, isLoading, explanation, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {isLoading ? (
            <>
              <ActivityIndicator size="large" color="#4ade80" />
              <Text style={styles.loadingText}>Generating explanation...</Text>
            </>
          ) : (
            <>
              <Text style={styles.explanationText}>{explanation}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    maxWidth: '85%',
  },
  loadingText: {
    marginTop: 10,
    color: '#f8fafc',
    fontSize: 16,
  },
  explanationText: {
    color: '#f8fafc',
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#4ade80',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#0f172a',
    fontWeight: 'bold',
  },
});
