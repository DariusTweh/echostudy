import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const StatsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Statistics</Text>

      {/* Study Activity */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Study Activity</Text>
        <BarChart
          data={{
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            datasets: [{ data: [1.5, 2, 1.7, 2.8, 3.5, 4.2, 2.3] }],
          }}
          width={screenWidth - 40}
          height={180}
          chartConfig={chartConfig}
          fromZero
          showValuesOnTopOfBars={false}
          withInnerLines={false}
          style={styles.chart}
        />
        <View style={styles.statRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>13h 30m</Text>
            <Text style={styles.statLabel}>Total Study Time</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>2h 15m</Text>
            <Text style={styles.statLabel}>Session Length</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>
      </View>

      {/* Flashcard Performance */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Flashcard Performance</Text>
        <View style={styles.row}>
          <PieChart
            data={[
              { name: 'Easy', population: 45, color: '#A3D9A5', legendFontColor: '#1E293B', legendFontSize: 12 },
              { name: 'Medium', population: 35, color: '#6EB5D6', legendFontColor: '#1E293B', legendFontSize: 12 },
              { name: 'Hard', population: 20, color: '#4361EE', legendFontColor: '#1E293B', legendFontSize: 12 },
            ]}
            width={140}
            height={140}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="10"
            absolute
          />
          <View style={styles.detailsColumn}>
            <Text style={styles.detail}>🕒 12s per card</Text>
            <Text style={styles.detail}>🎯 83% recall rate</Text>
            <Text style={styles.boldDetail}>Flaschem Terms</Text>
            <Text style={styles.detail}>[Most Studied]</Text>
            <Text style={styles.boldDetail}>Physics Equations</Text>
            <Text style={styles.detail}>Osmosis Steps</Text>
          </View>
        </View>
      </View>

      {/* Quiz Mode Stats */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Quiz Mode Stats</Text>
        <View style={styles.quizRow}>
          <Text style={styles.quizLabel}>Completion Rate</Text>
          <Text style={styles.quizPercent}>78%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '78%' }]} />
        </View>

        <View style={styles.quizRow}>
          <Text style={styles.quizLabel}>Multiple Choice</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '60%' }]} />
        </View>

        <View style={styles.quizRow}>
          <Text style={styles.quizLabel}>Matching</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '35%' }]} />
        </View>

        <View style={styles.tipBox}>
          <Text style={styles.tipText}>💡 Tip: Review the Algebra deck again</Text>
        </View>
      </View>
    </ScrollView>
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
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
    padding: 20,
    paddingTop:60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 12,
    color: '#475569',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8, // small buffer
  },
  detailsColumn: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20
    
   

  },
  detail: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 6,
  },
  boldDetail: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 2,
  },
  quizRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  quizLabel: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  quizPercent: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginTop: 4,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  tipBox: {
    backgroundColor: '#F1F5F9',
    padding: 10,
    borderRadius: 12,
    marginTop: 16,
  },
  tipText: {
    fontSize: 13,
    color: '#1E293B',
  },
});

export default StatsScreen;
