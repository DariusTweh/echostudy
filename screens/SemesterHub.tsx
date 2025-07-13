import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import AddClassModal from '../components/modals/AddClassModal';
import { supabase } from '../api/supabaseClient';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';

export default function SemesterHubScreen() {
  const navigation = useNavigation();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newClassTitle, setNewClassTitle] = useState('');
  const [newClassIcon, setNewClassIcon] = useState('');
  const [newClassFocus, setNewClassFocus] = useState('');
  const [addAnotherClass, setAddAnotherClass] = useState(false);

  const [weekSummary, setWeekSummary] = useState(null);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [showSyllabusUpload, setShowSyllabusUpload] = useState(false);
const [syllabusText, setSyllabusText] = useState('');
const [isLoadingSyllabus, setIsLoadingSyllabus] = useState(false);



  // Load class data
 const fetchClasses = async () => {
  setLoading(true);

  const { data: rawClasses, error } = await supabase
    .from('classes')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching classes:', error);
    setLoading(false);
    return;
  }

  const [assignments, quizzes, decks] = await Promise.all([
    supabase.from('assignments').select('id, class_id'),
    supabase.from('quizzes').select('id, class_id'),
    supabase.from('flashcard_decks').select('id, class_id'),
  ]);

  const getCount = (arr, id) => arr.filter(i => i.class_id === id).length;

  const enriched = rawClasses.map(cls => ({
    ...cls,
    assignmentCount: getCount(assignments.data || [], cls.id),
    quizCount: getCount(quizzes.data || [], cls.id),
    deckCount: getCount(decks.data || [], cls.id),
  }));

  setClasses(enriched);
  setLoading(false);
};

  const addNewClass = async () => {
    if (!newClassTitle || !newClassIcon) {
      alert('Please enter both title and icon.');
      return;
    }

    const { error } = await supabase.from('classes').insert({
      title: newClassTitle,
      icon: newClassIcon,
      focus: newClassFocus,
      status: 'UP TO DATE',
      user_id: (await supabase.auth.getUser()).data.user.id,
    });

    if (error) console.error('Error adding class:', error);
    else {
      setModalVisible(false);
      setNewClassTitle('');
      setNewClassIcon('');
      setNewClassFocus('');
      fetchClasses();
    }
  };

  const fetchWeeklySummary = async () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const [quizzes, assignments, flashcards] = await Promise.all([
      supabase.from('quizzes').select('*').gte('created_at', start.toISOString()).lte('created_at', end.toISOString()),
      supabase.from('assignments').select('*').gte('due_date', start.toISOString()).lte('due_date', end.toISOString()),
      supabase.from('flashcards').select('*').lte('next_review_date', end.toISOString()),
    ]);

    setWeekSummary({
      weekRange: `${start.toDateString()} - ${end.toDateString()}`,
      quizzesDue: quizzes.data?.length || 0,
      assignmentsDue: assignments.data?.length || 0,
      cardsLeft: flashcards.data?.length || 0,
    });
  };

  const fetchDeadlines = async () => {
    const { data } = await supabase
      .from('assignments')
      .select('*')
      .gt('due_date', new Date().toISOString())
      .order('due_date', { ascending: true })
      .limit(5);

    setUpcomingDeadlines(data || []);
  };
const handleBuildClassFromSyllabus = async () => {
  try {
    const file = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (file.canceled || !file.assets?.length) return false;

    setIsLoadingSyllabus(true);

    const { data: userData } = await supabase.auth.getUser();

    const formData = new FormData();
    formData.append('file', {
      uri: file.assets[0].uri,
      name: file.assets[0].name,
      type: 'application/pdf',
    });
    formData.append('userId', userData?.user?.id || '');

    const res = await fetch('http://192.168.0.187:5000/api/class-builder', {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: formData,
    });

    const result = await res.json();
    if (!result.title) throw new Error('Missing title');

    setNewClassTitle(result.title);
    setNewClassFocus(result.learning_goals?.[0] || '');
    await fetchClasses();

    if (!addAnotherClass) setModalVisible(false);
    return true;

  } catch (err) {
    console.error('Failed to parse syllabus:', err);
    alert('Could not extract class info from syllabus.');
    return false;
  } finally {
    setIsLoadingSyllabus(false);
  }
};

  useEffect(() => {
    fetchClasses();
    fetchWeeklySummary();
    fetchDeadlines();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>My Semester</Text>
        <Ionicons
          name="add-circle-outline"
          size={26}
          color="#2563EB"
          onPress={() => setModalVisible(true)}
        />
      </View>

      <View style={styles.innerCurved}>
        <ScrollView
  style={styles.scrollContent}
  contentContainerStyle={{ paddingBottom: 100 }} // prevent clipping
  showsVerticalScrollIndicator={false}
>
          {/* Week Overview */}
          {weekSummary && (
            <View style={styles.weekCard}>
              <View style={styles.weekHeaderRow}>
                <Text style={styles.weekTitle}>This Week | {weekSummary.weekRange}</Text>
                <TouchableOpacity><Text style={styles.calendarBtn}>View Calendar</Text></TouchableOpacity>
              </View>
              <Text style={styles.bullet}>• {weekSummary.quizzesDue} quizzes due</Text>
              <Text style={styles.bullet}>• {weekSummary.assignmentsDue} assignments</Text>
              <Text style={styles.bullet}>• {weekSummary.cardsLeft} cards to review</Text>
            </View>
          )}

          {/* AI Tip */}
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>💡 AI Tip</Text>
            <Text style={styles.tipText}>Review Organic Chem before Friday’s quiz</Text>
          </View>

          {/* Subject Cards */}
          {loading ? (
            <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 20 }} />
          ) : (
            classes.map((cls) => (
              <TouchableOpacity
                key={cls.id}
                style={styles.subjectCard}
                onPress={() => navigation.navigate('ClassScreen', { classData: cls })}
              >
                <View style={styles.subjectHeaderRow}>
                  <View style={styles.subjectLeft}>
                    <Ionicons name={cls.icon} size={20} color="#1E293B" style={{ marginRight: 8 }} />
                    <Text style={styles.subjectTitle}>{cls.title}</Text>
                  </View>
                  {cls.status && (
                    <View style={styles.statusPill}>
                      <Text style={styles.statusPillText}>{cls.status}</Text>
                    </View>
                  )}
                </View>

            <View style={styles.metaBox}>
  <View style={styles.metaRowIcon}>
    <Ionicons name="bullseye" size={16} color="#1E3A8A" style={{ marginRight: 8 }} />
    <Text style={styles.metaLabel}>Focus:</Text>
    <Text style={styles.metaValue}>{cls.focus || '-'}</Text>
  </View>
  <View style={styles.metaRow}>
    <Text style={styles.metaItem}>🧠 {cls.deckCount} decks</Text>
    <Text style={styles.metaItem}>🧪 {cls.quizCount} quizzes</Text>
    <Text style={styles.metaItem}>📘 {cls.assignmentCount} assignments</Text>
  </View>
</View>
              </TouchableOpacity>
            ))
          )}

          {/* Upcoming Deadlines */}
          <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
          <View style={styles.deadlineRow}>
            {upcomingDeadlines.map((item) => (
              <View key={item.id} style={styles.deadlineCard}>
                <Text style={styles.deadlineDate}>
                  {new Date(item.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
                <View>
                  <Text style={styles.deadlineSubject}>{item.title}</Text>
                  <Text style={styles.deadlineLabel}>{item.type}</Text>
                  {item.priority && <Text style={styles.deadlineExtra}>Priority: {item.priority}</Text>}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
      {isLoadingSyllabus && (
  <View style={styles.loadingOverlay}>
    <View style={styles.loadingBox}>
      <ActivityIndicator size="large" color="#2563EB" />
      <Text style={styles.loadingText}>Analyzing syllabus...</Text>
    </View>
  </View>
)}
<AddClassModal
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  onAddClass={addNewClass}
  newClassTitle={newClassTitle}
  setNewClassTitle={setNewClassTitle}
  newClassIcon={newClassIcon}
  setNewClassIcon={setNewClassIcon}
  newClassFocus={newClassFocus}
  setNewClassFocus={setNewClassFocus}
  handleBuildClassFromSyllabus={handleBuildClassFromSyllabus}
  autoCloseModal={true}
  addAnotherClass={addAnotherClass}
  setAddAnotherClass={setAddAnotherClass}
/>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    
    backgroundColor: '#FAFAF8',
  },
  outer: {
  flex: 1,
  backgroundColor: '#E5EAF3', // soft grayish blue
},
loadingOverlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
},
loadingBox: {
  backgroundColor: 'white',
  padding: 20,
  borderRadius: 12,
  alignItems: 'center',
},
loadingText: {
  marginTop: 10,
  fontSize: 16,
  color: '#1E293B',
  fontWeight: '600',
},
innerCurved: {
  flex: 1,
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
  container: {
    paddingTop:30,
    paddingHorizontal: 0,
  },
    headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal:20,
    paddingTop: 20,
    paddingBottom: 0,
  
   
  
  },
  headerText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
  },
title: {
  fontSize: 24,
  fontWeight: '700',
  color: '#0F172A',
  marginTop: 12,
  marginBottom: 20,
},
weekCard: {
  backgroundColor: '#F8FAFC',
  borderRadius: 16,
  padding: 20,
  marginBottom: 24,
  marginTop: 24,
  shadowColor: '#000',
  shadowOpacity: 0.03,
  shadowRadius: 4,
  elevation: 1,
},
weekHeaderRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',      // ✅ vertical alignment
  flexWrap: 'wrap',          // ✅ prevent overflow
  gap: 8,                    // ✅ add breathing room if using React Native 0.71+
},
  metaRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 5,
  marginBottom: 6,
},

metaItem: {
  fontSize: 13,
  color: '#475569',
  fontWeight: '500',
},

metaFocus: {
  fontSize: 13,
  color: '#64748B',
  fontStyle: 'italic',
  marginBottom: 6,
},
weekTitle: {
  fontSize: 16,
  fontWeight: '700',
  color: '#1E293B',
  flexShrink: 1,          // ✅ prevent overflow
  marginRight: 8,         // ✅ spacing before button
},
calendarBtn: {
  fontWeight: '600',
  color: '#4B5563',
  fontSize: 14,
  paddingVertical: 4,
  paddingHorizontal: 8,
},
bullet: {
  fontSize: 15,
  marginVertical: 4,
  color: '#334155',
},
  tipCard: {
    backgroundColor: '#F0F4F8',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  tipTitle: {
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#475569',
  },
  divider: {
  flex: 1,
  height: 1,
  backgroundColor: '#E2E8F0',
  marginHorizontal: 8,
},

   subjectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  subjectHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  statusPill: {
    backgroundColor: '#E0E7FF',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  metaBox: {
    backgroundColor: '#F1F5FF',
    borderRadius: 12,
    padding: 14,
  },
  metaRowIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaLabel: {
    fontWeight: '600',
    color: '#1E293B',
  },
  metaValue: {
    color: '#1E293B',
  },
  actionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 16,
    paddingTop: 12,
  },
  actionFooterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  nextTopic: {
    fontSize: 14,
    color: '#64748B',
  },
  progressBarBG: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginTop: 8,
  },
  progressBarFG: {
    height: 6,
    width: '60%',
    backgroundColor: '#1E40AF',
    borderRadius: 3,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionBtn: {
    fontWeight: '600',
    color: '#2563EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 24,
    marginBottom: 12,
  },
  deadlineRow: {
    flexDirection: 'row',
    gap: 12,
  },
deadlineCard: {
  flex: 1,
  backgroundColor: '#FFFFFF',
  borderRadius: 14,
  padding: 14,
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 1,
},
deadlineDate: {
  fontSize: 16,
  fontWeight: '700',
  color: '#0F172A',
  marginBottom: 4,
},
  deadlineSubject: {
    fontWeight: '700',
    color: '#1E293B',
    fontSize: 14,
  },
  deadlineLabel: {
    fontSize: 13,
    color: '#475569',
  },
  deadlineExtra: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
addButton: {
  position: 'absolute',
  bottom: 24,
  right: 24,
  backgroundColor: '#2563EB',
  width: 56,
  height: 56,
  borderRadius: 28,
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#2563EB',
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 6,
},
addButtonText: {
  color: '#fff',
  fontSize: 30,
  fontWeight: '700',
},
titleRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 12,
  marginBottom: 20,
},

addIcon: {
  fontSize: 26,
  fontWeight: '600',
  color: '#1E293B',
  marginRight: 2,
},

});