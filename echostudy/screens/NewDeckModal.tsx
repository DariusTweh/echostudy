// App.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const initialDecks = [
  {
    id: '1',
    title: 'Physics',
    subDecks: [
      { id: '1-1', title: 'Kinematics', cards: 10 },
      { id: '1-2', title: 'Thermodynamics', cards: 15 },
    ],
  },
  {
    id: '2',
    title: 'Biology',
    cards: 24,
  },
  {
    id: '3',
    title: 'MCAT',
    subDecks: [
      { id: '3-1', title: 'Psych/Soc', cards: 20 },
      { id: '3-2', title: 'CARS', cards: 15 },
      { id: '3-3', title: 'Bio/Biochem', cards: 25 },
    ],
  },
];

export default function ExpandableDecks() {
  const [expandedDecks, setExpandedDecks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [decks, setDecks] = useState(initialDecks);

  const toggleDeck = (id) => {
    setExpandedDecks((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleAddDeck = () => {
    const trimmed = newDeckName.trim();
    if (trimmed) {
      setDecks((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          title: trimmed,
          cards: 0,
        },
      ]);
      setNewDeckName('');
      setModalVisible(false);
    }
  };

  const renderDecks = () => {
    const items = [];

    decks.forEach((deck) => {
      items.push({ ...deck, type: 'main' });

      if (expandedDecks.includes(deck.id) && deck.subDecks) {
        deck.subDecks.forEach((sub) =>
          items.push({ ...sub, parentId: deck.id, type: 'sub' })
        );
      }
    });

    return items;
  };

  const renderItem = ({ item }) => {
    if (item.type === 'main') {
      const isExpanded = expandedDecks.includes(item.id);
      return (
        <TouchableOpacity style={styles.deckCard} onPress={() => item.subDecks && toggleDeck(item.id)}>
          <Text style={styles.deckTitle}>{item.title}</Text>
          <View style={styles.deckRight}>
            <Text style={styles.deckSubtitle}>
              {item.cards ? `${item.cards} cards` : `${item.subDecks.length} decks`}
            </Text>
            {item.subDecks && (
              <Ionicons
                name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                size={20}
                color="#64748B"
              />
            )}
          </View>
        </TouchableOpacity>
      );
    }

    if (item.type === 'sub') {
      return (
        <TouchableOpacity style={styles.subDeckCard}>
          <Text style={styles.subDeckTitle}>{item.title}</Text>
          <Text style={styles.subDeckSubtitle}>{item.cards} cards</Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={styles.background}>
      <View style={styles.contentWrapper}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <Text style={styles.headerText}>All Note Cards</Text>
          </View>

          <FlatList
            data={renderDecks()}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </SafeAreaView>

        {/* Bottom Actions */}
        <View style={styles.bottomTab}>
          <TouchableOpacity style={styles.tabButton}>
            <Ionicons name="bar-chart-outline" size={24} color="#fff" />
            <Text style={styles.tabText}>Stats</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabButtonCenter} onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle" size={40} color="#fff" />
            <Text style={styles.tabText}>New Deck</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabButton}>
            <Ionicons name="flash-outline" size={24} color="#fff" />
            <Text style={styles.tabText}>Quiz Mode</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for New Deck */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Create New Deck</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Organic Chemistry"
              value={newDeckName}
              onChangeText={setNewDeckName}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleAddDeck}>
              <Text style={styles.modalButtonText}>Add Deck</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#F0F4FF',
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: '#F0F4FF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#344E41',
  },
  deckCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginHorizontal: 15,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },
  deckTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  deckRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deckSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginRight: 6,
  },
  subDeckCard: {
    backgroundColor: '#e6ecff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 5,
  },
  subDeckTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E3A8A',
  },
  subDeckSubtitle: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 18,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
  },
  tabButtonCenter: {
    alignItems: 'center',
    marginBottom: 16,
  },
  tabText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
