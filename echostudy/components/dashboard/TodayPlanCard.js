
// components/dashboard/TodayPlanCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default function TodayPlanCard({ assignments }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Today’s Plan</Text>
      {assignments.length === 0 && (
        <Text style={styles.empty}>No assignments due today.</Text>
      )}
      {assignments.map((item) => (
        <View key={item.id} style={styles.item}>
          <Text style={styles.name}>{item.title}</Text>
          <Text style={styles.sub}>{item.type} – Due {new Date(item.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
      ))}
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
    marginBottom: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  sub: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  empty: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
