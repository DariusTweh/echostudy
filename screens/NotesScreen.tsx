import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { debounce } from 'lodash';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { supabase } from '../api/supabaseClient';
import colors from '../theme/colors';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 70;

export default function NotesScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    noteId,
    noteTitle: initialTitle = '',
    notebookColor = '#22C55E',
  } = route.params || {};

  const [noteTitle, setNoteTitle] = useState(initialTitle);
  const [pages, setPages] = useState([{ id: 1, content: '<p></p>' }]);
  const [loadingNote, setLoadingNote] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const getPagesWithPlaceholder = () => {
    if (!pages.some(p => p.id === 'placeholder')) {
      return [...pages, { id: 'placeholder', content: null }];
    }
    return pages;
  };

  useEffect(() => {
    if (!noteId) return;

    const fetchNote = async () => {
      setLoadingNote(true);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', noteId)
        .single();

      if (error) {
        console.error('Error fetching note:', error);
      } else if (data?.pages?.length > 0) {
        const cleanPages = data.pages.map((p, i) => ({
          id: p.id || i + 1,
          content: typeof p.content === 'string' ? p.content : '<p></p>',
        }));
        setNoteTitle(data.title || '');
        setPages(cleanPages);
      } else {
        setPages([{ id: 1, content: '<p></p>' }]);
      }
      setLoadingNote(false);
    };

    fetchNote();
  }, [noteId]);

  const updateNoteInSupabase = async (updatedTitle, updatedPages) => {
    if (!noteId) return;

    const { error } = await supabase
      .from('notes')
      .update({
        title: updatedTitle,
        pages: updatedPages,
        updated_at: new Date().toISOString(),
      })
      .eq('id', noteId);

    if (error) {
      console.error('Error auto-saving note:', error);
    }
  };

  const debouncedSave = useRef(
    debounce((newTitle, newPages) => {
      updateNoteInSupabase(newTitle, newPages);
    }, 1000)
  ).current;

  const setTitleAndSave = (text) => {
    setNoteTitle(text);
    debouncedSave(text, pages);
  };

  const addPage = () => {
    setPages((prev) => [...prev, { id: Date.now(), content: '<p></p>' }]);
  };

  const renderPage = ({ item, index }) => {
    if (item.id === 'placeholder') {
      return (
        <View style={styles.placeholderPage}>
          <Text style={styles.placeholderText}>Swipe to add a new page ⮕️</Text>
        </View>
      );
    }

    const characterCount = item.content && typeof item.content === 'string'
      ? item.content.replace(/<(.|\n)*?>/g, '').length
      : 0;

    return (
      <View style={{ width, height: height - HEADER_HEIGHT, flex: 1 }}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.headerIcon, { color: notebookColor }]}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.titleText, { color: notebookColor }]}>
              {noteTitle || 'Untitled Note'}
            </Text>
            <Text style={styles.subtitleText}>
              Page {index + 1} • {characterCount} characters
            </Text>
          </View>
        </View>

        <TextInput
          style={styles.titleInput}
          placeholder="Page title..."
          placeholderTextColor="#94A3B8"
          value={noteTitle}
          onChangeText={setTitleAndSave}
        />

        <View style={styles.editorWrapper}>
          <RichEditor
            key={`page-${item.id}`}
            initialContentHTML={item.content || '<p></p>'}
            useContainer={true}
            initialHeight={height - HEADER_HEIGHT}
            onChange={(html) => {
              setPages((prev) => {
                const updated = [...prev];
                updated[index] = { ...updated[index], content: html };
                debouncedSave(noteTitle, updated);
                return updated;
              });
            }}
            scrollEnabled={true}
            style={styles.richEditor}
            placeholder="Start typing your note..."
            editorStyle={{
              backgroundColor: '#fff',
              color: '#000',
              placeholderColor: '#888',
              contentCSSText: `
                font-size: 25px;
                line-height: 1.7;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
                padding: 12px;
                padding-bottom: 120px;
              `,
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <FlatList
            data={getPagesWithPlaceholder()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPage}
            onScrollEndDrag={(e) => {
              const offsetX = e.nativeEvent.contentOffset.x;
              const maxPageIndex = pages.length;
              const threshold = 0.5;
              const pageThreshold = (maxPageIndex - 1 + threshold) * width;

              if (offsetX >= pageThreshold) {
                addPage();
                setTimeout(() => setCurrentPage(pages.length), 50);
              } else {
                const index = Math.round(offsetX / width);
                setCurrentPage(index);
              }
            }}
          />

          <RichToolbar
            actions={[actions.setBold, actions.setItalic, actions.setUnderline, actions.insertBulletsList, actions.insertOrderedList, actions.insertLink]}
            iconMap={{
              [actions.setBold]: () => <Text style={styles.icon}>B</Text>,
              [actions.setItalic]: () => <Text style={styles.icon}>/</Text>,
              [actions.setUnderline]: () => <Text style={styles.icon}>U</Text>,
              [actions.insertBulletsList]: () => <Text style={styles.icon}>• List</Text>,
              [actions.insertOrderedList]: () => <Text style={styles.icon}>1. List</Text>,
              [actions.insertLink]: () => <Text style={styles.icon}>🔗</Text>,
            }}
            style={styles.toolbar}
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 4,
  },
  headerIcon: {
    fontSize: 20,
    color: colors.primary,
    marginHorizontal: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  subtitleText: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    marginHorizontal: 20,
    marginTop: 10,
    color: colors.text,
  },
  editorWrapper: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 30,
    backgroundColor: colors.editorBackground,
    overflow: 'hidden',
    
  },
  richEditor: {
    flex: 1,
    minHeight: height * 0.4,
  },
toolbar: {
  position: 'absolute',
  bottom: 0,
  width: '90%', // 🔥 fills the screen
  height: 56, // fixed height works better than percentage
  backgroundColor: colors.white,
  borderTopRightRadius: 10,
  borderTopLeftRadius: 10,
  alignItems: 'center',
  paddingVertical: 10,
  paddingHorizontal: 24,
  flexDirection: 'row',
  justifyContent: 'space-between',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 6,
  zIndex: 999,
},
  pageControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.primaryDark,
    paddingVertical: 10,
    paddingBottom: 14,
  },
icon: {
  fontSize: 18,
  color: colors.primaryDark,
  paddingHorizontal: 10,
},
});

