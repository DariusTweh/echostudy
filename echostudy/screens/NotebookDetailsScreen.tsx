import React, { useState, useEffect } from 'react';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,StyleSheet,Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from '../api/supabaseClient';


import AddNoteToNotebookModal from '../components/modals/AddNoteToNotebookModal';
import useNotebookNotes from '../hooks/useNotebookNotes';
import NoteCard from '../components/notes/NoteCard';


export default function NotebookDetailsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [addNoteVisible, setAddNoteVisible] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const SERVER_URL = 'http://192.168.0.187:5000';

  const navigation = useNavigation();
  const route = useRoute();
  const { notebook } = route.params;

  const { notes, loading, refetch } = useNotebookNotes(userId || '', notebook.id);

  useEffect(() => {
    const getUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        setUserId(sessionData.session.user.id);
      }
    };
    getUser();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (userId) refetch();
    }, [userId])
  );

  const filters = [
    { label: 'Concept', icon: 'leaf-outline' },
    { label: 'Lab', icon: 'flask-outline' },
    { label: 'Summary', icon: 'document-text-outline' },
    { label: 'Questions', icon: 'chatbox-ellipses-outline' },
  ];

  const filteredNotes = notes.filter((note) => {
    const matchesType = activeFilter ? note.type === activeFilter : true;
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

const handleUploadLecturePDF = async ({ title, type, file, autoGenerate }) => {
  if (!file || !userId) return;

  try {
    setUploading(true); // START LOADING

    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      type: 'application/pdf',
      name: file.name,
    });
    formData.append('userId', userId);
    formData.append('notebookId', notebook.id);

    const res = await fetch(`${SERVER_URL}/api/notes/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const data = await res.json();
    console.log('📥 Upload response:', data);

    if (data?.noteId) {
      setAddNoteVisible(false);
      navigation.navigate('NotesScreen', {
        noteId: data.noteId,
        notebookColor: notebook.color,
      });
    } else {
      Alert.alert('Error', data?.error || 'Note generation failed');
    }
  } catch (err) {
    console.error('❌ Upload error:', err);
    Alert.alert('Upload Error', 'Something went wrong while uploading the lecture.');
  } finally {
    setUploading(false); // END LOADING
  }
};

  return (
    <View style={[styles.safe, { backgroundColor: notebook.color }]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{notebook.title}</Text>
        <TouchableOpacity onPress={() => setAddNoteVisible(true)}>
          <Ionicons name="add-circle-outline" size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* Inner Section */}
      <View style={styles.innerCurved}>
        <View style={styles.fixedTop}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder={`Search notes in ${notebook.title}`}
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {filters.map((filter, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor:
                      activeFilter === filter.label ? notebook.color : `${notebook.color}30`,
                  },
                ]}
                onPress={() =>
                  setActiveFilter(activeFilter === filter.label ? null : filter.label)
                }
              >
                <Ionicons
                  name={filter.icon}
                  size={14}
                  color={activeFilter === filter.label ? '#fff' : notebook.color}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '500',
                    color: activeFilter === filter.label ? '#fff' : notebook.color,
                  }}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Notes List */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              title={note.title}
              icon={note.icon || 'document-text-outline'}
              date={new Date(note.updated_at).toLocaleDateString()}
              onPress={() =>
                navigation.navigate('NotesScreen', {
                  noteId: note.id,
                  notebookColor: notebook.color,
                })
              }
            />
          ))}
        </ScrollView>
      </View>

      {/* Add Note Modal */}
      <AddNoteToNotebookModal
        visible={addNoteVisible}
        notebookName={notebook.title}
        onClose={() => setAddNoteVisible(false)}
        onCreate={handleUploadLecturePDF}
        onManualCreate={async (title, type) => {
          const { data, error } = await supabase
            .from('notes')
            .insert([
              {
                user_id: userId,
                notebook_id: notebook.id,
                title,
                type,
                pages: [],
              },
            ])
            .select()
            .single();

          if (error) {
            console.error('Error creating note:', error);
            return;
          }

          setAddNoteVisible(false);
          navigation.navigate('NotesScreen', {
            noteId: data.id,
            notebookColor: notebook.color,
          });
        }}
      />
{uploading && (
  <View style={{
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center',
    zIndex: 999
  }}>
    <Text style={{ color: 'white', fontSize: 16 }}>Uploading and generating notes...</Text>
  </View>
)}

    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
  },
  fixedTop: {
  paddingHorizontal: 20,
  paddingBottom: 12,
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
    innerCurved: {
  flex: 1,
  backgroundColor: '#FFFFFF',
  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,
  paddingHorizontal: 5,  // keep side padding for internal content
  paddingTop: 30,
  paddingBottom: 20,
  marginTop: 10,
  width: '100%',         // <-- ensure it stretches to parent width
  alignSelf: 'stretch',  // <-- prevent shrinking
},
  filterScroll: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    height: 42,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
  },
  noteTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  noteDate: {
    fontSize: 13,
    color: '#6B7280',
  },

  loadingOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
},

loadingBox: {
  backgroundColor: '#1e293b',
  paddingVertical: 20,
  paddingHorizontal: 30,
  borderRadius: 16,
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 6,
  elevation: 10,
},

loadingText: {
  marginTop: 10,
  color: '#f8fafc',
  fontSize: 16,
  fontWeight: '500',
  textAlign: 'center',
},

});
