// components/EmptyState.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type EmptyStateProps = {
  onCreate: () => void;
};

export default function EmptyState({ onCreate }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="book-outline" size={40} color="#94A3B8" />
      <Text style={styles.message}>No notebooks yet</Text>
      <TouchableOpacity onPress={onCreate} style={styles.button}>
        <Text style={styles.buttonText}>+ Create Your First Notebook</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 40,
  },
  message: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 12,
  },
  button: {
    marginTop: 16,
  },
  buttonText: {
    color: '#2563EB',
    fontWeight: '600',
  },
});
