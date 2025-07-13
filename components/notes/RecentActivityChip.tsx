// components/notes/PinnedNoteCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PinnedNoteCard({ title, date }) {
  return (
    <View style={styles.card}>
      <Ionicons name="bulb-outline" size={18} color="#FBBF24" style={{ marginRight: 8 }} />
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    elevation: 1,
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  sub: {
    fontSize: 12,
    color: '#64748B',
  },
});
