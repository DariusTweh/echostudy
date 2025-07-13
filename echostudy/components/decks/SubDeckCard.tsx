// components/decks/SubDeckCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SubDeckCard({ title, cards, onPress }) {
  return (
    <TouchableOpacity style={styles.subDeckCard} onPress={onPress}>
      <Text style={styles.subDeckTitle}>{title}</Text>
      <Text style={styles.subDeckSubtitle}>{cards} cards</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  subDeckCard: {
    backgroundColor: '#F9FAFB',
    padding: 14,
    marginLeft: 24,
    borderRadius: 10,
    marginBottom: 10,
  },
  subDeckTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
  },
  subDeckSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
});
