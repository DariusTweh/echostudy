// components/notes/RecentChip.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RecentChip({ text }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  text: {
    fontSize: 13,
    color: '#0F172A',
  },
});
