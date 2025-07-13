// components/dashboard/SmartStudyChatCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default function SmartStudyChatCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Smart Study Chat</Text>
      <Text style={styles.subtext}>You asked: <Text style={styles.bold}>Explain photosynthesis</Text></Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Chat with Echo</Text>
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
  subtext: {
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
