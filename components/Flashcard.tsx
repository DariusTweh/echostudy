// /components/Flashcard.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


type FlashcardProps = {
  question: string;
  answer: string;
  onStudied?: () => void;
};

export default function Flashcard({ question, answer }: FlashcardProps) {
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);

  const handleShowAnswer = () => {
    setIsAnswerVisible(true);
    onStudied?.(); // mark as studied
  };

  const handleAIExplanation = () => {
    setIsExplanationVisible(true);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {/* Question View */}
        {!isAnswerVisible ? (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{question}</Text>
            <TouchableOpacity
              style={styles.aiButton}
              onPress={() => alert('AI Help Triggered')}>
              <Text style={styles.aiButtonText}>AI Help</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.showAnswerButton}
              onPress={handleShowAnswer}>
              <Text style={styles.showAnswerButtonText}>Show Answer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Answer View
          <View style={styles.answerContainer}>
            <Text style={styles.answerText}>{answer}</Text>
            <TouchableOpacity
              style={styles.aiExplanationButton}
              onPress={handleAIExplanation}>
              <Text style={styles.aiExplanationButtonText}>AI Explanation</Text>
            </TouchableOpacity>
            {isExplanationVisible && (
              <Text style={styles.explanationText}>
                Here is the AI explanation of the answer...
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardContent: {
    alignItems: 'center',
  },
  questionContainer: {
    alignItems: 'center',
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  aiButton: {
    padding: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    marginBottom: 12,
  },
  aiButtonText: {
    color: 'white',
    fontSize: 16,
  },
  showAnswerButton: {
    padding: 8,
    backgroundColor: '#2196F3',
    borderRadius: 8,
  },
  showAnswerButtonText: {
    color: 'white',
    fontSize: 16,
  },
  answerContainer: {
    alignItems: 'center',
  },
  answerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  aiExplanationButton: {
    padding: 8,
    backgroundColor: '#FF5722',
    borderRadius: 8,
    marginBottom: 12,
  },
  aiExplanationButtonText: {
    color: 'white',
    fontSize: 16,
  },
  explanationText: {
    fontSize: 16,
    color: '#888',
    marginTop: 12,
  },
});
