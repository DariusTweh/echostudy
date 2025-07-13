// components/decks/RecentDeckCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RecentDeckCard({ title, cards, lastStudied }) {
  return (
    <View style={styles.recentDeckCard}>
      <Text style={styles.recentLabel}>Recent Deck</Text>
      <Text style={styles.recentDeckTitle}>{title}</Text>
      <Text style={styles.recentDeckSub}>{cards} cards · Last studied {lastStudied}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
recentDeckCard: {
    backgroundColor: '#F3F2ED',
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  recentLabel: {
    fontSize: 13,
    color: '#78716C',
    marginBottom: 2,
  },
  recentDeckTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },
  recentDeckSub: {
    fontSize: 13,
    color: '#78716C',
    marginTop: 4,
  },
});
