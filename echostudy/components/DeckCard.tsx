import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Flashcard from './Flashcard'; // Import the Flashcard component

const DeckCard = ({ deck }: any) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardText}>{deck.name}</Text>
      <ScrollView>
        {deck.flashcards.map((flashcard, index) => (
          <Flashcard key={index} flashcard={flashcard} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 200,
    height: 250,
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DeckCard;
