// Updated ProfileScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const ProfileScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Avatar and Name */}
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle-outline" size={72} color="#1E3A8A" />
          <Text style={styles.name}>Darius Tweh</Text>
          <Text style={styles.bio}>Pre-Med Student · Biology Major</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="flame-outline" size={22} color="#EF4444" />
            <Text style={styles.statTitle}>Streak</Text>
            <Text style={styles.statValue}>5 days</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="star-outline" size={22} color="#FACC15" />
            <Text style={styles.statTitle}>Echo Points</Text>
            <Text style={styles.statValue}>540 pts</Text>
          </View>
          <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('StatsScreen')}>
            <Ionicons name="bar-chart-outline" size={22} color="#3B82F6" />
            <Text style={styles.statTitle}>Performance</Text>
            <Text style={styles.statLink}>View Stats</Text>
          </TouchableOpacity>
        </View>

        {/* Study Activity Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Study Activity</Text>
          <BarChart
            data={{
              labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
              datasets: [{ data: [1.5, 2, 1.7, 2.8, 3.5, 4.2, 2.3] }],
            }}
            width={screenWidth - 48}
            height={180}
            chartConfig={chartConfig}
            fromZero
            showValuesOnTopOfBars={false}
            withInnerLines={false}
            style={styles.chart}
          />
        </View>

        {/* Settings Menu */}
        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={20} color="#1E293B" style={styles.menuIcon} />
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="create-outline" size={20} color="#1E293B" style={styles.menuIcon} />
            <Text style={styles.menuText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="log-out-outline" size={20} color="#1E293B" style={styles.menuIcon} />
            <Text style={styles.menuText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
  labelColor: () => '#475569',
  barPercentage: 0.5,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    padding: 24,
    paddingBottom: 100,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 8,
  },
  bio: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginTop: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 4,
  },
  statLink: {
    fontSize: 12,
    color: '#3B82F6',
    marginTop: 4,
    fontWeight: '600',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
});

export default ProfileScreen;