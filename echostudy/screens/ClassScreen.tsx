import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ClassInfoModal from '../components/modals/ClassInfoModal';
import AssignmentModal from '../components/modals/AssignmentModal';
import AddAssignmentModal from '../components/modals/AddAssignmentModal';
import { supabase } from '../api/supabaseClient';

const ClassScreen = ({ route, navigation }) => {
  const { classData } = route.params;

  const [currentUserId, setCurrentUserId] = useState(null);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [assignmentModalVisible, setAssignmentModalVisible] = useState(false);
  const [addAssignmentModalVisible, setAddAssignmentModalVisible] = useState(false);
  const [keepAdding, setKeepAdding] = useState(false);

  const [assignments, setAssignments] = useState([]);
  const [assignmentsDueToday, setAssignmentsDueToday] = useState([]);
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentDueDate, setNewAssignmentDueDate] = useState('');
  const [newAssignmentStatus, setNewAssignmentStatus] = useState('');
  const [newAssignmentType, setNewAssignmentType] = useState('');
  const [newAssignmentPriority, setNewAssignmentPriority] = useState('');

  const previewAssignments = [...assignments]
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 3);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) setCurrentUserId(data.user.id);
      else console.error('Error fetching user:', error);
    };
    fetchUser();
  }, []);

  const handleOpenAddAssignmentModal = () => {
    setNewAssignmentTitle('');
    setNewAssignmentDueDate('');
    setNewAssignmentStatus('Not Started');
    setNewAssignmentType('Lab');
    setNewAssignmentPriority('Medium');
    setAddAssignmentModalVisible(true);
  };

  const addAssignment = async () => {
    if (
      !newAssignmentTitle ||
      !newAssignmentDueDate ||
      !newAssignmentStatus ||
      !newAssignmentType ||
      !newAssignmentPriority
    ) {
      alert('Please fill all fields.');
      return;
    }

    if (!currentUserId) {
      alert('User not authenticated. Please log in again.');
      return;
    }

    const { data, error } = await supabase.from('assignments').insert({
      title: newAssignmentTitle,
      due_date: newAssignmentDueDate,
      status: newAssignmentStatus,
      type: newAssignmentType,
      priority: newAssignmentPriority,
      completed: newAssignmentStatus === 'Done',
      class_id: classData.id,
      user_id: currentUserId,
    });

    if (error) {
      console.error('Error adding assignment:', error);
    } else {
      if (!keepAdding) setAddAssignmentModalVisible(false);
      setNewAssignmentTitle('');
      setNewAssignmentDueDate('');
      setNewAssignmentStatus('Not Started');
      setNewAssignmentType('Lab');
      setNewAssignmentPriority('Medium');
      setTimeout(() => fetchAssignments(), 600);
    }
  };

  const fetchAssignments = async () => {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('class_id', classData.id)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching assignments:', error);
    } else {
      setAssignments(data);
      const todayStr = new Date().toISOString().split('T')[0];
      const dueToday = data.filter(a => a.due_date === todayStr);
      setAssignmentsDueToday(dueToday);
    }
  };

  useEffect(() => {
    if (classData.id) {
      fetchAssignments();
    }
  }, [classData.id]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#1E3A8A" />
          </TouchableOpacity>
          <Ionicons
            name={classData.icon}
            size={22}
            color="#1E3A8A"
            style={{ marginHorizontal: 6 }}
          />
          <Text style={styles.classTitle}>{classData.title}</Text>
          <TouchableOpacity onPress={() => setInfoModalVisible(true)}>
            <Ionicons name="information-circle-outline" size={22} color="#1E3A8A" />
          </TouchableOpacity>
        </View>
        <Text style={styles.scheduleText}>Status: {classData.status || '-'}</Text>
      </View>

      {/* Week Tag */}
      <View style={styles.weekTag}>
        <Ionicons name="folder-outline" size={18} color="#1E3A8A" />
        <Text style={styles.weekText}>Focus: {classData.focus || 'No focus set'}</Text>
      </View>

      <ScrollView style={styles.innerCurved} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Smart Suggestions */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Smart Suggestions</Text>
        </View>

        {/* Assignments Due Today */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Due Today</Text>
          {assignmentsDueToday.length === 0 ? (
            <Text style={{ fontStyle: 'italic', color: '#64748B', marginTop: 4 }}>
              No assignments due today.
            </Text>
          ) : (
            assignmentsDueToday.map((assignment) => (
              <View key={assignment.id} style={styles.assignmentRow}>
                <Ionicons
                  name={assignment.completed ? 'checkmark-done-outline' : 'time-outline'}
                  size={20}
                  color={assignment.completed ? '#1E3A8A' : '#F59E0B'}
                  style={{ marginRight: 6 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowText}>{assignment.title}</Text>
                  <Text style={styles.assignmentDate}>
                    {new Date(assignment.due_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Upcoming Assignments */}
        <View style={styles.card} onLongPress={() => setAssignmentModalVisible(true)}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitle}>Assignments</Text>
            <TouchableOpacity onPress={handleOpenAddAssignmentModal}>
              <Ionicons name="add-circle-outline" size={22} color="#1E3A8A" />
            </TouchableOpacity>
          </View>

          {previewAssignments.length === 0 ? (
            <Text style={{ fontStyle: 'italic', color: '#64748B', marginTop: 8 }}>
              No assignments yet.
            </Text>
          ) : (
            previewAssignments.map((assignment) => (
              <View key={assignment.id} style={styles.assignmentRow}>
                <Text style={styles.rowText}>{assignment.title}</Text>
                <Text style={styles.assignmentDate}>
                  {new Date(assignment.due_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: assignment.completed ? '#D1FAE5' : '#FECACA',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: assignment.completed ? '#065F46' : '#991B1B' },
                    ]}
                  >
                    {assignment.completed ? 'Done' : 'Not Done'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Resources */}
        <TouchableOpacity style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitle}>Resources</Text>
            <Ionicons name="add-circle-outline" size={22} color="#1E3A8A" />
          </View>

          <View style={styles.resourceRow}>
            <Ionicons name="document-text-outline" size={18} color="#1E3A8A" />
            <Text style={styles.resourceText}>Lecture Slides – Week 5.pdf</Text>
          </View>
          <View style={styles.resourceRow}>
            <Ionicons name="link-outline" size={18} color="#1E3A8A" />
            <Text style={styles.resourceText}>Khan Academy: Enzymes</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Modals */}
      <ClassInfoModal visible={infoModalVisible} onClose={() => setInfoModalVisible(false)} />
      <AssignmentModal visible={assignmentModalVisible} onClose={() => setAssignmentModalVisible(false)} />
      <AddAssignmentModal
        visible={addAssignmentModalVisible}
        onClose={() => setAddAssignmentModalVisible(false)}
        onAddAssignment={addAssignment}
        newAssignmentTitle={newAssignmentTitle}
        setNewAssignmentTitle={setNewAssignmentTitle}
        newAssignmentDueDate={newAssignmentDueDate}
        setNewAssignmentDueDate={setNewAssignmentDueDate}
        newAssignmentStatus={newAssignmentStatus}
        setNewAssignmentStatus={setNewAssignmentStatus}
        newAssignmentType={newAssignmentType}
        setNewAssignmentType={setNewAssignmentType}
        newAssignmentPriority={newAssignmentPriority}
        setNewAssignmentPriority={setNewAssignmentPriority}
        keepAdding={keepAdding}
        setKeepAdding={setKeepAdding}
      />
    </View>
  );
};

export default ClassScreen;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF6',
  },
headerContainer: {
  paddingTop: 80,
  paddingBottom: 12,
  paddingHorizontal: 20,
  backgroundColor: '#FAFAF6',
},

headerRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

headerContent: {
  alignItems: 'center',
  marginTop: 6,
},
classTitle: {
  fontSize: 20,
  fontWeight: '700',
  color: '#111827',
  textAlign: 'center',
  flex: 1,
},

scheduleText: {
  fontSize: 14,
  color: '#6B7280',
  textAlign: 'center',
  marginTop: 4,
},
  weekTag: {
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#E0F2FE',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    marginBottom: 12,
  },
  weekText: {
    fontSize: 14,
    color: '#1E3A8A',
  },
  innerCurved: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rowText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  dateText: {
    fontSize: 13,
    color: '#6B7280',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addLink: {
    fontSize: 14,
    color: '#2563EB',
    marginTop: 6,
    fontWeight: '500',
  },
  assignmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  assignmentDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardHeaderRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 10,
},

resourceRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  marginBottom: 8,
},

resourceText: {
  fontSize: 14,
  color: '#1F2937',
  flexShrink: 1,
},
});
