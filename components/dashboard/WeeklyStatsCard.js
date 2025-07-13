// components/dashboard/WeeklyStatsCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default function WeeklyStatsCard({ stats }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>This Week</Text>
      <Text style={styles.item}>Flashcards Reviewed: <Text style={styles.bold}>{stats.flashcards}</Text></Text>
      <Text style={styles.item}>Quizzes Completed: <Text style={styles.bold}>{stats.quizzes}</Text></Text>
      <Text style={styles.item}>Study Streak: <Text style={styles.bold}>{stats.streak} days 🔥</Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  item: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  bold: {
    fontWeight: '700',
  },
});
