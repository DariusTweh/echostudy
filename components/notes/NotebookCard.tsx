// components/notes/NotebookCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NotebookCard({ title, noteCount, icon, color, onPress }) {
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: color }]} onPress={onPress}>
      <Ionicons name={icon} size={20} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{noteCount} notes</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
});
