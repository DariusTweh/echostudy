import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../api/supabaseClient';
import AddFlashcardModal from '../components/modals/AddFlashcardModal';
import colors from '../theme/colors';
import ExplanationLoadingModal from '../components/modals/ExplanationLoadingModal';
import * as Speech from 'expo-speech';
import Voice from '@react-native-voice/voice';
import VoiceModeModal from '../components/modals/VoiceModeModal';
export default function FlashcardScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { deckName, deckId } = route.params;

  const [flashcards, setFlashcards] = useState([]);
 const [showModal, setShowModal] = useState(false);
const [loadingExplanation, setLoadingExplanation] = useState(false);
const [explanation, setExplanation] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ newCards: 0, learningCards: 0, reviewCards: 0 });
  const [listening, setListening] = useState(false);
const [spokenAnswer, setSpokenAnswer] = useState('');
const [voiceFeedback, setVoiceFeedback] = useState('');
const [voiceModalVisible, setVoiceModalVisible] = useState(false);

  console.log('📌 Current deckId:', deckId);


const fetchFlashcards = async () => {
  const today = new Date().toISOString();

  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('deck_id', deckId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('LOAD ERROR:', error);
  } else {
    setFlashcards(data);

    // Compute Anki-like stats
    const newCards = data.filter(card => card.repetitions === 0).length;
    const learningCards = data.filter(card => card.repetitions > 0 && card.interval < 6).length;
    const reviewCards = data.filter(card => card.repetitions > 0 && card.interval >= 6).length;

    setStats({ newCards, learningCards, reviewCards });
  }
};
const fetchExplanation = async () => {
  setShowModal(true);
  setLoadingExplanation(true);
  setExplanation('');

  try {
    const user = await supabase.auth.getUser();
    const userId = user.data.user.id;

    const { data: profile } = await supabase
      .from('profiles')
      .select('interests, tone_preference')
      .eq('id', userId)
      .single();

    if (!profile) {
      console.warn('User profile not found');
      setExplanation('User profile not found.');
      return;
    }

    const response = await fetch('http://192.168.0.187:5000/api/flashcards/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        flashcardId: currentCard.id,
        userId,
      }),
    });

    const result = await response.json();

    if (result.explanation) {
      setExplanation(result.explanation);
    } else {
      setExplanation('No explanation found.');
    }
  } catch (err) {
    console.error(err);
    setExplanation('Error fetching explanation.');
  } finally {
    setLoadingExplanation(false);
  }
};

useEffect(() => {
  fetchFlashcards();
}, [deckId]);

useEffect(() => {
  const markDeckAsStudied = async () => {
    await supabase
      .from('flashcard_decks')
      .update({ last_studied: new Date().toISOString() })
      .eq('id', deckId);
  };

  markDeckAsStudied();
}, [deckId]);

const handleSaveFlashcard = async ({ term, definition, tags, image, addAnother }) => {  const { data, error } = await supabase
    .from('flashcards')
    .insert([{
      deck_id: deckId,
      term,
      definition,
      tags,
      ai_generated: false,
      source_note_id: null,
      last_reviewed: null,
      next_review_date: null,
      ease_factor: 2.5,
      interval: 1,
      repetitions: 0,
    }])
    .select()
    .single();

  if (error) {
    console.error('❌ INSERT ERROR:', error);
  } else {
    console.log('✅ Flashcard inserted:', data);
    setFlashcards(prev => [...prev, data]); // ✅ instant UI update
    if (!addAnother) {
  setModalVisible(false);
}
  }
};

  const currentCard = flashcards.length > 0 ? flashcards[currentIndex] : null;


  const goToNextCard = () => {
    setShowAnswer(false);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const renderEmptyState = () => (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>No flashcards found for "{deckName}".</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={{ marginTop: 20, color: '#3B82F6', fontWeight: '600' }}>+ Add First Card</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ marginTop: 10, color: '#64748B' }}>← Go Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );


  const updateCardWithSM2 = async (cardId, quality) => {
      const card = flashcards.find(c => c.id === cardId);
      if (!card) return;

      let { ease_factor, interval, repetitions } = card;
      ease_factor = ease_factor || 2.5;
      interval = interval || 1;
      repetitions = repetitions || 0;

      if (quality < 3) {
        repetitions = 0;
        interval = 1;
      } else {
        if (repetitions === 0) {
          interval = 1;
        } else if (repetitions === 1) {
          interval = 6;
        } else {
          interval = Math.round(interval * ease_factor);
        }

        repetitions += 1;
        ease_factor = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        if (ease_factor < 1.3) ease_factor = 1.3;
      }

      const next_review_date = new Date();
      next_review_date.setDate(next_review_date.getDate() + interval);

      // Update flashcard in Supabase
      const { error } = await supabase
        .from('flashcards')
        .update({
          ease_factor,
          interval,
          repetitions,
          last_reviewed: new Date().toISOString(),
          next_review_date: next_review_date.toISOString(),
        })
        .eq('id', cardId);

      if (error) {
        console.error('❌ Update error:', error);
      }

      // Update user_flashcard_progress
      await updateUserFlashcardProgress(cardId, quality);

      // Update local state and move to next card
      setFlashcards(prev =>
        prev.map(c => c.id === cardId
          ? {
              ...c,
              ease_factor,
              interval,
              repetitions,
              last_reviewed: new Date().toISOString(),
              next_review_date: next_review_date.toISOString(),
            }
          : c
        )
      );
      await fetchFlashcards(); // Refresh flashcards & stats
      goToNextCard();
      

    };

const updateUserFlashcardProgress = async (cardId, quality) => {
  const userId = (await supabase.auth.getUser()).data.user.id;

  const { data: existing } = await supabase
    .from('user_flashcard_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('flashcard_id', cardId)
    .single();

  let total_reviews = existing?.total_reviews || 0;
  let successful_reviews = existing?.successful_reviews || 0;
  let average_quality = existing?.average_quality || 0;

  total_reviews += 1;
  if (quality >= 3) successful_reviews += 1;
  average_quality = ((average_quality * (total_reviews - 1)) + quality) / total_reviews;

  const { error } = await supabase
    .from('user_flashcard_progress')
    .upsert({
      user_id: userId,
      flashcard_id: cardId,
      total_reviews,
      successful_reviews,
      average_quality,
      last_review_date: new Date().toISOString(),
      last_quality: quality
    });

  if (error) {
    console.error('❌ Progress update error:', error);
  }
};


  return (
    <>
      {(!flashcards || flashcards.length === 0) ? (
        renderEmptyState()
      ) : (
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={28} color="#0F172A" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>{deckName}</Text>

            <View style={styles.headerRight}>
              <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginRight: 16 }}>
                <Ionicons name="add" size={26} color="#0F172A" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("Settings tapped")}>
                <Ionicons name="settings-outline" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.card} onPress={() => setShowAnswer(true)} disabled={!currentCard}>
  <Text style={styles.question}>
    {currentCard ? currentCard.term : 'Loading card...'}
  </Text>
  <TouchableOpacity style={styles.aiButton} onPress={() => setVoiceModalVisible(true)}>
  <Text style={styles.aiIcon}>🧠</Text>
  <Text style={styles.aiText}>Voice Mode</Text>
</TouchableOpacity>
  {showAnswer && currentCard && (
    <>
      <View style={styles.divider} />
      <Text style={styles.answer}>{currentCard.definition}</Text>

    

      <TouchableOpacity style={styles.aiButton} onPress={fetchExplanation}>
        <Text style={styles.aiIcon}>🎤</Text>
        <Text style={styles.aiText}>AI Background Explanation</Text>
      </TouchableOpacity>
    </>
  )}
</TouchableOpacity>
          <View style={styles.buttonRow}>
            {showAnswer ? (
              <>
                <TouchableOpacity style={styles.circleBtn}  onPress={() => updateCardWithSM2(currentCard.id, 2)}>
                  <Text style={styles.labelTop}>{'<1m'}</Text>
                  <Text style={styles.labelBottom}>Again</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.circleBtn} onPress={() => updateCardWithSM2(currentCard.id, 3)}>
                  <Text style={styles.labelTop}>{'<6m'}</Text>
                  <Text style={styles.labelBottom}>Hard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.circleBtn} onPress={() => updateCardWithSM2(currentCard.id, 5)}>
                  <Text style={styles.labelTop}>{'3d'}</Text>
                  <Text style={styles.labelBottom}>Easy</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={[styles.circleBtn, { backgroundColor: '#344E41' }]}>
                  <Text style={styles.circleText}>{stats.newCards}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.circleBtn, { backgroundColor: '#D9534F' }]}>
                  <Text style={styles.circleText}>{stats.learningCards}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.circleBtn, { backgroundColor: '#588157' }]}>
                  <Text style={styles.circleText}>{stats.reviewCards}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </SafeAreaView>
      )}

      <AddFlashcardModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSaveFlashcard}
      />
      <ExplanationLoadingModal
  visible={showModal}
  isLoading={loadingExplanation}
  explanation={explanation}
  onClose={() => setShowModal(false)}
/>
<VoiceModeModal
  visible={voiceModalVisible}
  onClose={() => setVoiceModalVisible(false)}
  term={currentCard?.term}
  definition={currentCard?.definition}
  onNext={goToNextCard}
/>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 20,
  paddingTop: 16,
  paddingBottom: 12,
},
headerTitle: {
  fontSize: 20,
  fontWeight: '700',
  color: '#0F172A',
},
headerRight: {
  flexDirection: 'row',
  alignItems: 'center',
},
  backArrow: {
    fontSize: 26,
    color: colors.primaryDark,
    marginHorizontal: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primaryDark,
  },
card: {
  flex:1,
  backgroundColor: '#FFFFFF',
  borderRadius: 24,
  padding: 28,
  marginHorizontal: 16,
  marginTop: 40,
  minHeight: 360,
  justifyContent: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 3,
},
  question: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 28,
  },
divider: {
  width: '80%',
  height: 1,
  backgroundColor: '#1E293B', // change to test visibility
  alignSelf: 'center',
  marginVertical: 15,
},
  answer: {
    fontSize: 17,
    color: colors.primaryDark,
    textAlign: 'center',
    lineHeight: 26,
  },
aiButton: {
  flexDirection: 'row',
  backgroundColor: '#E0EAFF',
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 14,
  alignItems: 'center',
  marginTop: 30,
},
aiIcon: {
  fontSize: 16,
  marginRight: 8,
  color: '#3B82F6',
},
aiText: {
  color: '#1E3A8A',
  fontWeight: '600',
  fontSize: 14,
  marginLeft: 8,
},
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginRight: 1,
  },
  circleBtn: {
    width: 72,
    height: 72,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 25,
    backgroundColor: colors.primary,
  },
  circleText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
labelBtn: {
   // take equal horizontal space
  backgroundColor: '#E2E8F0',
  width: 72,
  height: 72,
   borderRadius: 12,
  paddingVertical: 14,
  paddingHorizontal: 12,
  alignItems: 'center',
  justifyContent: 'center',
  marginHorizontal: 25,
},
labelTop: {
  fontSize: 13,
  color: '#1E293B',
  fontWeight: '500',
  textAlign: 'center',
},

labelBottom: {
  fontSize: 14,
  fontWeight: '700',
  color: '#0F172A',
  textAlign: 'center',
},
});
