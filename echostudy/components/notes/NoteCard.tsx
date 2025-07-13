import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NoteCard({ title, icon, date, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Ionicons name={icon} size={18} style={styles.icon} />
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>Last edited: {date}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  icon: {
    marginRight: 10,
    color: '#0F172A',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  date: {
    fontSize: 13,
    color: '#6B7280',
  },
});
