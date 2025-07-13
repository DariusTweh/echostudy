import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const QuizResultsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExplanation, setSelectedExplanation] = useState('');

  const { quizTitle = 'Quiz', score = 7, total = 10, time = '5 min', results = [] } = route.params || {};
  const percentage = Math.round((score / total) * 100);

  return (
    <View style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quiz Results</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Inner Body */}
      <View style={styles.innerCurved}>
        <Text style={styles.quizTitle}>{quizTitle}</Text>

        <View style={styles.progressWrapper}>
          <AnimatedCircularProgress
            size={140}
            width={12}
            fill={percentage}
            tintColor="#3B82F6"
            backgroundColor="#E5E7EB"
            rotation={0}
            lineCap="round"
          >
            {() => (
              <Text style={styles.percentageText}>{percentage}%</Text>
            )}
          </AnimatedCircularProgress>
          <Text style={styles.resultLabel}>Score: {score}/{total}</Text>
          <Text style={styles.timeText}>⏱ {time}</Text>
        </View>

        <Text style={styles.subHeader}>Questions Review</Text>

        <ScrollView style={{ flex: 1 }}>
        {results.map((item, index) => {
  const explanation = item.explanation || 'Chlorophyll absorbs light for photosynthesis.';
  const content = (
    <View
      style={[
        styles.resultItem,
        item.correct ? styles.correct : styles.incorrect,
      ]}
    >
      <Ionicons
        name={item.correct ? 'checkmark-circle' : 'close-circle'}
        size={20}
        color={item.correct ? '#22C55E' : '#EF4444'}
        style={{ marginRight: 10 }}
      />
      <Text style={styles.resultText}>{item.question}</Text>
    </View>
  );

  return item.correct ? (
    content
  ) : (
    <TouchableOpacity
      key={index}
      onLongPress={() => {
        setSelectedExplanation(explanation);
        setModalVisible(true);
      }}
    >
      {content}
    </TouchableOpacity>
  );
})}

        </ScrollView>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.outlineBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.outlineText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryBtn}>
            <Text style={styles.primaryText}>Retake Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>
      {modalVisible && (
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>
      <Text style={styles.modalTitle}>Explanation</Text>
      <Text style={styles.modalContent}>{selectedExplanation}</Text>
      <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
        <Text style={styles.modalButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
)}
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#1E3A8A',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 48 : 28,
    paddingBottom: 16,
    marginTop:40,
    paddingHorizontal: 20,
    backgroundColor: '#1E3A8A',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  innerCurved: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  quizTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  percentageText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3B82F6',
  },
  resultLabel: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  correct: {
    backgroundColor: '#ECFDF5',
  },
  incorrect: {
    backgroundColor: '#FEF2F2',
  },
  resultText: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
    flexWrap: 'wrap',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  outlineBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  outlineText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  primaryBtn: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  primaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  modalOverlay: {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999,
},
modalBox: {
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 16,
  width: '80%',
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowRadius: 10,
  elevation: 5,
},
modalTitle: {
  fontSize: 16,
  fontWeight: '700',
  marginBottom: 10,
  color: '#1E293B',
},
modalContent: {
  fontSize: 14,
  color: '#334155',
  marginBottom: 16,
},
modalButton: {
  backgroundColor: '#3B82F6',
  paddingVertical: 10,
  borderRadius: 10,
},
modalButtonText: {
  textAlign: 'center',
  color: '#fff',
  fontWeight: '600',
  fontSize: 14,
},
});

export default QuizResultsScreen;
