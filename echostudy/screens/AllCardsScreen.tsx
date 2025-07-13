import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { supabase } from '../api/supabaseClient';

// Components
import AddDeckModal from '../components/modals/AddDeckModal';
import AddSubdeckModal from '../components/modals/AddSubdeckModal';
import RecentDeckCard from '../components/decks/RecentDeckCard';
import MainDeckCard from '../components/decks/MainDeckCard';
import SubDeckCard from '../components/decks/SubDeckCard';
import SwipeActions from '../components/decks/SwipeActions';
import LoadingCard from '../components/decks/LoadingCard';

export default function DeckScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [subdeckModalVisible, setSubdeckModalVisible] = useState(false);
  const [activeParentDeckId, setActiveParentDeckId] = useState(null);
  const [expandedDecks, setExpandedDecks] = useState([]);
  const [decks, setDecks] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchDecks();
    }, [])
  );

  const fetchDecks = async () => {
    const { data, error } = await supabase
      .from('flashcard_decks')
      .select('id, title, parent_deck_id, last_studied, status')
      .order('last_studied', { ascending: false, nullsLast: true });

    if (error) {
      console.error('❌ Failed to load decks:', error);
      return;
    }

    const grouped = [];
    data.forEach(deck => {
      if (!deck.parent_deck_id) {
        grouped.push({ ...deck, subDecks: [] });
      }
    });
    data.forEach(deck => {
      if (deck.parent_deck_id) {
        const parent = grouped.find(d => d.id === deck.parent_deck_id);
        if (parent) {
          parent.subDecks.push(deck);
        }
      }
    });

    const anyGenerating = data.some(deck => deck.status === 'generating');
    setIsGenerating(anyGenerating);
    setDecks(grouped);
  };

  const handleAddDeck = async (deckName) => {
    const trimmed = deckName.trim();
    if (!trimmed) return;

    const { data, error } = await supabase
      .from('flashcard_decks')
      .insert([{ title: trimmed }])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating deck:', error);
      return;
    }

    setDecks(prev => [...prev, { ...data, subDecks: [] }]);
  };

  const handleAddSubDeck = (parentId) => {
    setActiveParentDeckId(parentId);
    setSubdeckModalVisible(true);
  };

  const submitSubDeck = async (subdeckName) => {
    const trimmed = subdeckName.trim();
    if (!trimmed || !activeParentDeckId) return;

    const { data, error } = await supabase
      .from('flashcard_decks')
      .insert([{ title: trimmed, parent_deck_id: activeParentDeckId }])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating subdeck:', error);
      return;
    }

    fetchDecks();
    setSubdeckModalVisible(false);
  };

  const toggleDeck = (id) => {
    setExpandedDecks(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleImportComplete = async (newSubdeckId, newSubdeckTitle) => {
    await fetchDecks();
    navigation.navigate('FlashcardScreen', {
      deckName: newSubdeckTitle,
      deckId: newSubdeckId,
    });
  };

  const renderDecks = () => {
    const items = [];
    const recentDeck = decks.length > 0 ? decks[0] : null;

    if (recentDeck) {
      items.push({ ...recentDeck, type: 'recent' });
    }

    decks.forEach(deck => {
      items.push({ ...deck, type: 'main' });
      if (expandedDecks.includes(deck.id) && deck.subDecks) {
        deck.subDecks.forEach(sub =>
          items.push({ ...sub, parentId: deck.id, type: 'sub' })
        );
      }
    });

    return items;
  };

  const renderItem = ({ item }) => {
    if (item.type === 'main') {
      return (
        <MainDeckCard
          item={item}
          isExpanded={expandedDecks.includes(item.id)}
          onToggle={toggleDeck}
          onNavigate={(title) =>
            navigation.navigate('FlashcardScreen', {
              deckName: title,
              deckId: item.id,
            })
          }
          renderActions={(progress, dragX) => (
            <SwipeActions
              dragX={dragX}
              onEdit={() => alert('Edit')}
              onAdd={() => handleAddSubDeck(item.id)}
              onDelete={() => alert('Delete')}
            />
          )}
        />
      );
    }
    if (item.type === 'sub') {
      return (
        <SubDeckCard
          title={item.title}
          cards={item.cards}
          onPress={() =>
            navigation.navigate('FlashcardScreen', {
              deckName: item.title,
              deckId: item.id,
            })
          }
        />
      );
    }
    if (item.type === 'recent') {
      return (
        <RecentDeckCard
          title={item.title}
          cards={item.cards}
          lastStudied={item.last_studied}
        />
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>All Note Cards</Text>
        <View style={styles.iconRow}>
          <Ionicons
            name="bar-chart-outline"
            size={22}
            style={{ marginHorizontal: 10 }}
            onPress={() => navigation.navigate('StatsScreen')}
          />
          <Ionicons
            name="add-circle-outline"
            size={22}
            onPress={() => setModalVisible(true)}
          />
        </View>
      </View>

      <View style={styles.innerCurved}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={18}
            color="#9CA3AF"
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search note cards"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {isGenerating && <LoadingCard />}

        <FlatList
          data={renderDecks()}
          keyExtractor={(item, index) => `${item.type}-${item.id}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>

      <AddDeckModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddDeck}
      />
      <AddSubdeckModal
        visible={subdeckModalVisible}
        onClose={() => setSubdeckModalVisible(false)}
        onSubmit={submitSubDeck}
        activeParentDeckId={activeParentDeckId}
        onImportComplete={async (newSubdeckId, newSubdeckTitle) => {
          await fetchDecks();
          setExpandedDecks(prev => [...prev, activeParentDeckId]);
        }}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF9',
  },
    iconRow: {
  flexDirection: 'row',
  alignItems: 'center',
  padding:10,
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
  searchContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#F1F5F9',
  marginHorizontal: 16,
  borderRadius: 12,
  paddingHorizontal: 12,
  paddingVertical: Platform.OS === 'ios' ? 12 : 8,
  marginBottom: 16,
  marginTop: 0,
},
searchInput: {
  flex: 1,
  fontSize: 15,
  color: '#0F172A',
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
  recentDeckCard: {
    backgroundColor: '#F3F2ED',
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  recentLabel: {
    fontSize: 13,
    color: '#78716C',
    marginBottom: 2,
  },
  recentDeckTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },
  recentDeckSub: {
    fontSize: 13,
    color: '#78716C',
    marginTop: 4,
  },
  deckCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deckTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  deckRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deckSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginRight: 6,
  },
  subDeckCard: {
    backgroundColor: '#E0EFFE',
    marginHorizontal: 32,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    elevation: 1,
shadowColor: '#000',
shadowOpacity: 0.05,
shadowRadius: 4,
  },
  subDeckTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  subDeckSubtitle: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  swipeActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '82%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  swipeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  swipeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
