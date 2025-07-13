// components/dashboard/AiSuggestionsCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default function AiSuggestionsCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>AI Suggestions</Text>
      <Text style={styles.tip}>📌 <Text style={styles.bold}>Review Cell Membranes</Text> before tomorrow’s quiz.</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Review</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.softCard,
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
  tip: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  bold: {
    fontWeight: '700',
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    marginTop: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.textOnAccent,
    fontWeight: '600',
  },
});
