// screens/DeckDetailScreen.tsx
import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import Flashcard from '../components/Flashcard';

type Flashcard = {
  question: string;
  answer: string;
};

type Deck = {
  id: string;
  name: string;
  flashcards: Flashcard[];
};

type DeckDetailProps = {
  route: RouteProp<{ params: { deck: Deck } }, 'params'>;
};

export default function DeckDetailScreen({ route }: DeckDetailProps) {
  const { deck } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasStudied, setHasStudied] = useState(false);

  const handleNext = () => {
    setHasStudied(false);
    setCurrentIndex((prev) => Math.min(prev + 1, deck.flashcards.length - 1));
  };

  if (!deck.flashcards || deck.flashcards.length === 0) {
    return <View><Text>No flashcards in this deck.</Text></View>;
  }

  const currentFlashcard = deck.flashcards[currentIndex];

  return (
    <View style={styles.container}>
            <Flashcard
        question={currentFlashcard.question}
        answer={currentFlashcard.answer}
        onStudied={() => setHasStudied(true)} // ✅ enables "Next" after studying
        />
      {currentIndex < deck.flashcards.length - 1 ? (
        <View style={styles.nextButtonContainer}>
          <Button
            title="Next"
            onPress={handleNext}
            disabled={!hasStudied} // ✅ Only enable after studying
          />
        </View>
      ) : (
        <View style={styles.nextButtonContainer}>
          <Button title="Finish" onPress={() => alert('Deck completed!')} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  nextButtonContainer: {
    marginTop: 20,
  },
});
