// components/dashboard/RecentlyViewedCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default function RecentlyViewedCard({ items, onNavigate }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Recently Viewed</Text>
      {items.length === 0 && (
        <Text style={styles.empty}>No recent activity.</Text>
      )}
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.item}
          onPress={() => onNavigate(item)}
        >
          <Text style={styles.name}>{item.title}</Text>
          <Text style={styles.sub}>{item.type}</Text>
        </TouchableOpacity>
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
    marginBottom: 12,
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