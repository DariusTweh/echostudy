import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../api/supabaseClient';
import AddNoteModal from '../components/modals/AddNoteModal';
import QuickNoteModal from '../components/modals/QuickNoteModal';
import CreateNotebookModal from '../components/modals/CreateNotebookModal';

import useNotebooks from '../hooks/useNotebooks';
import useQuickNotes from '../hooks/useQuickNotes';
import usePinnedNotes from '../hooks/usePinnedNotes';
import useRecentNotes from '../hooks/useRecentNotes';


import NotebookCard from '../components/notes/NotebookCard';
import RecentActivityChip from '../components/notes/RecentActivityChip';
import QuickNotePill from '../components/notes/QuickNotePill';
import EmptyState from '../components/notes/EmptyState';
import useSmartSuggestions from '../hooks/useSmartSuggestions';

export default function AllNotesScreen() {
 const [userId, setUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [quickNoteVisible, setQuickNoteVisible] = useState(false);
  const [createNotebookVisible, setCreateNotebookVisible] = useState(false);
  const { pinnedNotes } = usePinnedNotes(userId || '');
  const { recentNotes } = useRecentNotes(userId || '');
  const [selectedQuickNote, setSelectedQuickNote] = useState<any | null>(null);

  const { suggestions } = useSmartSuggestions(userId || '');

  const navigation = useNavigation();

  useEffect(() => {
  const getUser = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData?.session) {
      console.error('No active session:', sessionError);
      return;
    }

    const { user } = sessionData.session;
    setUserId(user.id);
    };

    getUser();
  }, []);

  // Only use hooks after userId is available
// Call hooks with default/fallback userId (e.g., empty string)
const { notebooks, addNotebook } = useNotebooks(userId || '');
const { quickNotes, addQuickNote } = useQuickNotes(userId || '');


  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>All Notes</Text>
        <View style={styles.iconRow}>
          <Ionicons name="filter-outline" size={22} style={{ marginRight: 16 }} />
          <Ionicons
            name="add-circle-outline"
            size={22}
            onPress={() => setModalVisible(true)}
          />
        </View>
      </View>

      {/* Inner Curved Section */}
      <View style={styles.innerCurved}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
  {/* Notebook Grid */}
  <Text style={styles.sectionTitle}>Your Notebooks</Text>
  {notebooks.length > 0 ? (
    <View style={styles.grid}>
      {notebooks.map((item, index) => (
        <NotebookCard
          key={index}
          title={item.title}
          icon={item.icon || 'book-outline'}
          color={item.color || '#E5E7EB'}
          noteCount={item.note_count || 0}
          onPress={() =>
            navigation.navigate('NotebookDetails', { notebook: item })
          }
        />

      ))}
    </View>
  ) : (
    <EmptyState onCreate={() => setCreateNotebookVisible(true)} />
  )}

      <Text style={styles.sectionTitle}>Pinned Notes</Text>
      {pinnedNotes.length > 0 ? (
        pinnedNotes.map((note, index) => (
          <TouchableOpacity
            key={index}
            style={styles.cardRow}
            onPress={() => navigation.navigate('NoteDetails', { note })}
          >
            <Ionicons name="bulb-outline" size={18} color="#FBBF24" style={{ marginRight: 8 }} />
            <View>
              <Text style={styles.cardTitle}>{note.title}</Text>
              <Text style={styles.cardSubtitle}>
                Last edited {new Date(note.updated_at).toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Ionicons name="information-circle-outline" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
          <Text style={styles.cardSubtitle}>No pinned notes yet</Text>
        </View>
      )}


        <Text style={styles.sectionTitle}>Smart Suggestions</Text>
            {suggestions.length > 0 ? (
              suggestions.map((item, index) => (
                <View key={index} style={styles.cardRow}>
                  <Ionicons name="bulb-outline" size={18} color="#3B82F6" style={{ marginRight: 8 }} />
                  <Text style={styles.cardSubtitle}>{item.text}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyCard}>
                <Ionicons name="sparkles-outline" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
                <Text style={styles.cardSubtitle}>No suggestions right now</Text>
              </View>
            )}
          {/* Recent Activity */}
          <Text style={styles.sectionTitle}>Recent Activity</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.recentScroll}
            >
              {recentNotes.length > 0 ? (
                recentNotes.map((note, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => navigation.navigate('NoteDetails', { note })}
                    style={styles.activityChip}
                  >
                    <Text style={styles.activityText}>{note.title}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyChip}>
                  <Ionicons name="time-outline" size={16} color="#9CA3AF" style={{ marginRight: 4 }} />
                  <Text style={styles.activityText}>No recent activity</Text>
                </View>
              )}
            </ScrollView>

          {/* Quick Notes */}
          <Text style={styles.sectionTitle}>Quick Notes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentScroll}>
            {quickNotes.length > 0 ? (
              quickNotes.map((note, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedQuickNote(note);
                    setQuickNoteVisible(true);
                  }}
                >
                  <QuickNotePill text={note.text} />
                </TouchableOpacity>
              ))
            ) : (
              <QuickNotePill text="No quick notes yet" />
            )}
          </ScrollView>
        </ScrollView>

        {/* Modals */}
        <AddNoteModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelect={(type) => {
            setModalVisible(false);
            if (type === 'quick') setQuickNoteVisible(true);
            else if (type === 'notebook') setCreateNotebookVisible(true);
          }}
        />

        <QuickNoteModal
          visible={quickNoteVisible}
           onClose={() => {
              setQuickNoteVisible(false);
              setSelectedQuickNote(null);
            }}
          onSave={(text, id) => {
              if (id) {
                // update existing note
                supabase
                  .from('quick_notes')
                  .update({ text })
                  .eq('id', id)
                  .then(() => {
                    setQuickNoteVisible(false);
                    setSelectedQuickNote(null);
                  });
              } else {
                addQuickNote(text);
                setQuickNoteVisible(false);
              }
            }}
          note={selectedQuickNote}
        />

        <CreateNotebookModal
          visible={createNotebookVisible}
          onClose={() => setCreateNotebookVisible(false)}
          onCreate={(newNotebook) => addNotebook(newNotebook)}
        />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
    color: '#0F172A',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 10,
  },
  pinnedNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    elevation: 1,
    marginBottom: 20,
  },
  noteTitle: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  noteSub: {
    fontSize: 12,
    color: '#64748B',
  },
  suggestionCard: {
    flexDirection: 'row',
    backgroundColor: '#E0F2FE',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  suggestionText: {
    fontSize: 14,
    color: '#0F172A',
  },
  recentScroll: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  recentChip: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  recentChipText: {
    fontSize: 13,
    color: '#0F172A',
  },
  quickNotePill: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 10,
  },
  quickNoteText: {
    fontSize: 13,
    color: '#0F172A',
  },
  cardRow: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#F9FAFB',
  padding: 12,
  borderRadius: 10,
  marginBottom: 8,
},

emptyCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#F3F4F6',
  padding: 12,
  borderRadius: 10,
  marginBottom: 8,
  opacity: 0.8,
},

cardTitle: {
  fontSize: 15,
  fontWeight: '600',
  color: '#0F172A',
},

cardSubtitle: {
  fontSize: 13,
  color: '#6B7280',
},
activityChip: {
  backgroundColor: '#E5E7EB',
  borderRadius: 20,
  paddingHorizontal: 12,
  paddingVertical: 6,
  marginRight: 8,
  flexDirection: 'row',
  alignItems: 'center',
},

emptyChip: {
  backgroundColor: '#F3F4F6',
  borderRadius: 20,
  paddingHorizontal: 12,
  paddingVertical: 6,
  flexDirection: 'row',
  alignItems: 'center',
  opacity: 0.8,
},

activityText: {
  fontSize: 13,
  color: '#374151',
},

});
