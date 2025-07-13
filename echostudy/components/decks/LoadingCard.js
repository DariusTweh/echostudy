import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator,Platform, } from 'react-native';

export default function LoadingCard() {
  return (
    <View style={styles.card}>
      <ActivityIndicator size="small" color="#3B82F6" />
      <Text style={styles.text}>Generating flashcards from PDF...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  text: {
    marginLeft: 10,
    color: '#1E3A8A',
    fontSize: 14,
  },
});
