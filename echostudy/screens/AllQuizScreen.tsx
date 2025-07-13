import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CreateQuizModal from '../components/modals/CreateQuizModal';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../api/supabaseClient';

export default function QuizScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [createQuizVisible, setCreateQuizVisible] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('quizzes')
      .select('*, quiz_questions(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quizzes:', error);
    } else {
      setQuizzes(data);
    }
    setLoading(false);
  };

  const filteredQuizzes = quizzes.filter((q) =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>All Quizzes</Text>
        <View style={styles.iconRow}>
          <Ionicons name="filter-outline" size={22} style={{ marginRight: 16 }} />
          <Ionicons
            name="add-circle-outline"
            size={22}
            onPress={() => setCreateQuizVisible(true)}
            style={{ marginLeft: 12 }}
          />
        </View>
      </View>

      <View style={styles.innerCurved}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search quizzes"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#facc15" style={{ marginTop: 30 }} />
        ) : (
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>All Quizzes</Text>
            {filteredQuizzes.map((quiz) => (
              <View key={quiz.id} style={styles.simpleCard}>
                <Text style={styles.quizTitle}>{quiz.title}</Text>
                <Text style={styles.quizMeta}>
                  {quiz.quiz_questions?.length || 0} questions
                </Text>
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() =>
                    navigation.navigate('QuizTaking', {
                      quizTitle: quiz.title,
                      questions: quiz.quiz_questions.map((q) => ({
                        id: q.id,
                        type: q.type,
                        question: q.question,
                        options: q.options,
                        answer: q.answer,
                        explanation: q.explanation,
                      })),
                    })
                  }
                >
                  <Text style={styles.startButtonText}>Start Quiz</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <CreateQuizModal
        visible={createQuizVisible}
        onClose={() => setCreateQuizVisible(false)}
       onCreate={async (quizInfo) => {
  try {
    const response = await fetch('http://192.168.0.187:5000/generate-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: quizInfo.title,
        types: quizInfo.types,
        source: quizInfo.source,
        numberOfQuestions: parseInt(quizInfo.numberOfQuestions, 10),
        mode: quizInfo.mode,
        userId: 'demo-user',         // replace with real user ID
        deckId: selectedDeckId,      // only if source === 'Deck'
        pdfPath: selectedPdfPath,    // only if source === 'Upload PDF'
      }),
    });

    const result = await response.json();
    if (result.quizId && result.questions) {
      // Optionally: navigate directly to the quiz
      navigation.navigate('QuizTaking', {
        quizTitle: quizInfo.title,
        questions: result.questions,
      });
    }
  } catch (err) {
    console.error('Error generating quiz:', err);
  }
}}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#1E3A8A',
  },
   headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 20,
  },
  innerCurved: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
  },
  scrollContent: {
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  quizCard: {
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: 20,
  marginRight: 12,
  width: 220,
  shadowColor: '#000',
  shadowOpacity: 0.04,
  shadowRadius: 4,
  elevation: 1,
},
smartCard: {
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: 20,
  marginBottom: 16,
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowRadius: 6,
  elevation: 1,
  position: 'relative',
},
simpleCard: {
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: 20,
  marginBottom: 16,
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 1,
  position: 'relative',
},
startButton: {
  backgroundColor: '#3B82F6', // Use your app’s primary accent
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 999,
  alignSelf: 'flex-start',
  marginTop: 10,
},
startButtonText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: '600',
},
  quizTitle: {
  fontSize: 16,
  fontWeight: '700',
  color: '#0F172A',
  marginBottom: 6,
},
quizSubtitle: {
  fontSize: 14,
  color: '#64748B',
  marginBottom: 8,
},
quizMeta: {
  fontSize: 13,
  color: '#6B7280',
  marginTop: 8,
},
quizTag: {
  fontSize: 13,
  color: '#6B7280',
  marginTop: 6,
},
  scoreBubble: {
    backgroundColor: '#22C55E',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 13,
    fontWeight: '600',
    overflow: 'hidden',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  playIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
    backgroundColor: '#2563EB',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
