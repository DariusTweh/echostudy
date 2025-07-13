import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function QuizTakingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const route = useRoute();
  const navigation = useNavigation();
  const { quizTitle = 'Quiz', questions = [] } = route.params || {};

  const current = questions[currentIndex];

  const handleSelect = (value) => {
    setUserAnswers({ ...userAnswers, [current.id]: value });
  };

const checkAnswer = (question, userAnswer) => {
  if (!userAnswer) return false;

  if (question.type === 'mcq' || question.type === 'truefalse') {
    return question.options[0] === userAnswer; // Assumes first option is correct (replace this with actual correct answer logic)
  }

  // For short/blank answers, we just check if anything is written
  return userAnswer.trim().length > 0;
};

  const handleFlag = () => {
    setFlagged({ ...flagged, [current.id]: !flagged[current.id] });
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

const handleNext = () => {
  if (currentIndex < questions.length - 1) {
    setCurrentIndex(currentIndex + 1);
  } else {
    // Quiz is complete, calculate results
    const results = questions.map((q) => ({
      question: q.question,
      correct: userAnswers[q.id] && checkAnswer(q, userAnswers[q.id]),
    }));

    const score = results.filter((r) => r.correct).length;

    navigation.navigate('QuizResults', {
      quizTitle,
      score,
      total: results.length,
      time: '4 min', // You can replace this with actual timing later
      results,
    });
  }
};

  const handleSkip = () => handleNext();

  const renderOptions = () => {
    return current.options.map((option, idx) => (
      <TouchableOpacity
        key={idx}
        onPress={() => handleSelect(option)}
        style={[
          styles.option,
          userAnswers[current.id] === option && styles.selectedOption,
        ]}
      >
        <Text
          style={[
            styles.optionText,
            userAnswers[current.id] === option && { color: '#fff' },
          ]}
        >
          {option}
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.safe}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{quizTitle}</Text>
        <TouchableOpacity onPress={handleFlag}>
          <Ionicons
            name={flagged[current.id] ? 'flag' : 'flag-outline'}
            size={20}
            color={flagged[current.id] ? '#EF4444' : '#64748B'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.innerCurved}>
        <Text style={styles.progressText}>
          Question {currentIndex + 1} of {questions.length}
        </Text>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentIndex + 1) / questions.length) * 100}%` },
            ]}
          />
        </View>

        <Text style={styles.questionText}>{current.question}</Text>
            <View style={styles.divider} />
        <View style={styles.answerBlock}>
          {current.type === 'mcq' || current.type === 'truefalse' ? (
            renderOptions()
          ) : (
            <TextInput
              style={styles.input}
              placeholder={
                current.type === 'fillblank'
                  ? 'Type the missing word...'
                  : 'Write your answer...'
              }
              value={userAnswers[current.id] || ''}
              onChangeText={(text) => handleSelect(text)}
              multiline={current.type === 'short'}
            />
          )}
        </View>

        <View style={styles.footerNav}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
            <Text style={styles.nextText}>Next →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#1E3A8A',
  },
headerRow: {
  width: '100%',
  paddingHorizontal: 24,
  paddingTop: Platform.OS === 'ios' ? 60 : 40, // use SafeArea-like spacing
  marginBottom: 12,
  marginTop:30,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
  headerTitle: {
    fontSize: 20,
    
    fontWeight: '700',
    color: '#FFFFFF',
  },
    innerCurved: {
  flex: 1,
  position:"bottom",
  backgroundColor: '#FFFFFF',
  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,
  paddingHorizontal: 20,  // keep side padding for internal content
  paddingTop: 30,
  paddingBottom: 20,
  marginTop: 10,
  width: '100%',         // <-- ensure it stretches to parent width
  alignSelf: 'stretch',  // <-- prevent shrinking
},
  progressText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 6,
    textAlign: 'center',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
    
  },
  progressFill: {
    height: 6,
    backgroundColor: '#3B82F6',
    paddingHorizontal:20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 24,
  },
  answerBlock: {
    marginBottom: 32,
  },
  option: {
    backgroundColor: '#E2E8F0',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#3B82F6',
  },
  optionText: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  footerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  nextBtn: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },

  nextText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
