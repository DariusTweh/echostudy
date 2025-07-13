import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../api/supabaseClient';
import colors from '../theme/colors';

import SmartStudyChatCard from '../components/dashboard/SmartStudyChatCard';
import TodayPlanCard from '../components/dashboard/TodayPlanCard';
import RecentlyViewedCard from '../components/dashboard/RecentlyViewedCard';
import AiSuggestionsCard from '../components/dashboard/AiSuggestionsCard';
import WeeklyStatsCard from '../components/dashboard/WeeklyStatsCard';

export default function Dashboard() {
  const navigation = useNavigation();

  const [classes, setClasses] = useState([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);
  const [recentDeck, setRecentDeck] = useState(null);
  const [recentNotebook, setRecentNotebook] = useState(null);
  const [recentQuiz, setRecentQuiz] = useState(null);

  const weeklyStats = {
    flashcards: 88,
    quizzes: 3,
    streak: 4,
  };

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) console.error('Error fetching classes:', error);
    else setClasses(data);
  };

  const fetchUpcomingAssignments = async () => {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .gte('due_date', new Date().toISOString().split('T')[0])
      .order('due_date', { ascending: true })
      .limit(5);

    if (error) console.error('Error fetching assignments:', error);
    else setUpcomingAssignments(data);
  };

  const fetchRecentDeck = async (user_id) => {
    const { data, error } = await supabase
      .from('flashcard_decks')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) console.error('Error fetching deck:', error);
    else setRecentDeck(data?.[0]);
  };

  const fetchRecentNotebook = async (user_id) => {
    const { data, error } = await supabase
      .from('notebooks')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) console.error('Error fetching notebook:', error);
    else setRecentNotebook(data?.[0]);
  };

  const fetchRecentQuiz = async (user_id) => {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) console.error('Error fetching quiz:', error);
    else setRecentQuiz(data?.[0]);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error('❌ Error fetching user ID:', userError?.message);
        return;
      }

      const user_id = userData.user.id;

      await Promise.all([
        fetchClasses(),
        fetchUpcomingAssignments(),
        fetchRecentDeck(user_id),
        fetchRecentNotebook(user_id),
        fetchRecentQuiz(user_id),
      ]);
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.safe}> 
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Welcome back, Darius</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
            <Ionicons name="person-circle-outline" size={35} color="#1E293B" />
          </TouchableOpacity>
        </View>
        <Text style={styles.subheader}>4 days in a row – 540 pts</Text>

        <SmartStudyChatCard />
        <TodayPlanCard assignments={upcomingAssignments} />
        <RecentlyViewedCard
          items={[
            ...(recentDeck ? [{ id: recentDeck.id, title: recentDeck.title, type: 'Flashcard Deck' }] : []),
            ...(recentNotebook ? [{ id: recentNotebook.id, title: recentNotebook.title, type: 'Notebook' }] : []),
            ...(recentQuiz ? [{ id: recentQuiz.id, title: recentQuiz.title, type: 'Quiz' }] : []),
          ]}
          onNavigate={(item) => {
            if (item.type === 'Flashcard Deck') navigation.navigate('FlashcardScreen', { deckData: recentDeck });
            else if (item.type === 'Notebook') navigation.navigate('NotebookDetails', { notebookId: recentNotebook.id });
            else if (item.type === 'Quiz') navigation.navigate('QuizScreen', { quizData: recentQuiz });
          }}
        />
        <AiSuggestionsCard />
        <WeeklyStatsCard stats={weeklyStats} />

        <Text style={styles.sectionTitle}>Class Progress</Text>
        {classes.map((cls) => (
          <TouchableOpacity
            key={cls.id}
            style={styles.classCard}
            onPress={() => navigation.navigate('ClassScreen', { classData: cls })}
            onLongPress={() => navigation.navigate('SemesterHub')}
          >
            <View style={styles.classHeaderRow}>
              <View style={styles.classLeft}>
                <Ionicons
                  name={cls.icon || 'school-outline'}
                  size={20}
                  color={colors.primary}
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.classTitle}>{cls.title}</Text>
              </View>
              {cls.status !== '' && (
                <View style={styles.statusPill}>
                  <Text style={styles.statusText}>{cls.status}</Text>
                </View>
              )}
            </View>

            <View style={styles.metaBox}>
              <View style={styles.metaRow}>
                <Ionicons name="bulb-outline" size={16} color={colors.icon} style={styles.metaIcon} />
                <Text style={styles.metaLabel}>Focus:</Text>
                <Text style={styles.metaValue}>{cls.focus || '-'}</Text>
              </View>
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.footerAction}>Study</Text>
              <Text style={styles.footerAction}>Review</Text>
              <Text style={styles.footerAction}>Progress</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subheader: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 24,
    marginBottom: 12,
  },
  classCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  classHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  classLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  classTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statusPill: {
    backgroundColor: '#E0E7FF',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  metaBox: {
    backgroundColor: '#F1F5FF',
    borderRadius: 12,
    padding: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaIcon: {
    marginRight: 6,
  },
  metaLabel: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginRight: 6,
  },
  metaValue: {
    color: colors.textPrimary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 16,
    paddingTop: 12,
  },
  footerAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A8A',
  },
});
