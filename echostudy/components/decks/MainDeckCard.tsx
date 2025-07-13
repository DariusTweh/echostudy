// components/decks/MainDeckCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

export default function MainDeckCard({ item, isExpanded, onToggle, onNavigate, renderActions }) {
  return (
    <Swipeable renderRightActions={renderActions}>
      <TouchableOpacity
        style={styles.deckCard}
        onPress={() =>
          item.cards !== undefined ? onNavigate(item.title) : onToggle(item.id)
        }
      >
        <Text style={styles.deckTitle}>{item.title}</Text>
        <View style={styles.deckRight}>
          <Text style={styles.deckSubtitle}>
            {item.cards !== undefined
              ? `${item.cards} cards`
              : `${item.subDecks?.length || 0} decks`}
          </Text>
          {item.subDecks && (
            <Ionicons
              name={isExpanded ? 'chevron-down' : 'chevron-forward'}
              size={20}
              color="#64748B"
            />
          )}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  deckCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deckTitle: { fontSize: 16, fontWeight: '600', color: '#1E293B' },
  deckSubtitle: { fontSize: 14, color: '#64748B' },
  deckRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
