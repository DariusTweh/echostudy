import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const AssignmentModal = ({ visible, onClose }) => {
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Upcoming Assignments</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* Toggle Buttons */}
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleButton, viewMode === 'week' && styles.activeToggle]}
              onPress={() => setViewMode('week')}
            >
              <Text style={[styles.toggleText, viewMode === 'week' && styles.activeToggleText]}>This Week</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, viewMode === 'month' && styles.activeToggle]}
              onPress={() => setViewMode('month')}
            >
              <Text style={[styles.toggleText, viewMode === 'month' && styles.activeToggleText]}>This Month</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={{ marginTop: 16 }}>
            {viewMode === 'week' ? (
              <View style={styles.card}>
                <Text style={styles.item}>🧪 Lab Report — Due Wednesday</Text>
                <Text style={styles.item}>📖 Chapter 12 Quiz — Friday</Text>
              </View>
            ) : (
              <View style={styles.card}>
                <Text style={styles.item}>🧪 Lab Report — June 5</Text>
                <Text style={styles.item}>📖 Chapter 12 Quiz — June 7</Text>
                <Text style={styles.item}>📝 Essay Draft — June 15</Text>
                <Text style={styles.item}>📊 Group Presentation — June 27</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AssignmentModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  closeText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeToggle: {
    backgroundColor: '#1E3A8A',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  activeToggleText: {
    color: 'white',
  },
  card: {
    marginTop: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  item: {
    fontSize: 14,
    marginBottom: 8,
    color: '#1F2937',
  },
});
