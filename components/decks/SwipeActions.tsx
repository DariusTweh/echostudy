// components/decks/SwipeActions.tsx
import React from 'react';
import { Animated, Text, TouchableOpacity, StyleSheet, View,Platform } from 'react-native';

export default function SwipeActions({ dragX, onEdit, onAdd, onDelete }) {
  const translateX = dragX.interpolate({
    inputRange: [-150, 0],
    outputRange: [0, 150],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.swipeActionContainer, { transform: [{ translateX }] }]}>
      <TouchableOpacity style={[styles.swipeButton, { backgroundColor: '#3B82F6' }]} onPress={onEdit}>
        <Text style={styles.swipeText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.swipeButton, { backgroundColor: '#10B981' }]} onPress={onAdd}>
        <Text style={styles.swipeText}>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.swipeButton, { backgroundColor: '#EF4444' }]} onPress={onDelete}>
        <Text style={styles.swipeText}>Delete</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF9',
  },
    
  swipeActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '82%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  swipeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  swipeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

