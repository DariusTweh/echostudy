// components/notes/QuickNotePill.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function QuickNotePill({ text }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.text} numberOfLines={1}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 10,
  },
  text: {
    fontSize: 13,
    color: '#0F172A',
  },
});
