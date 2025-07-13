import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Platform } from 'react-native';

// Screens
import Dashboard from '../screens/Dashboard';
import SemesterHub from '../screens/SemesterHub';
import AllCardsScreen from '../screens/AllCardsScreen';
import AllNotesScreen from '../screens/AllNotesScreen';
import AllQuizScreen from '../screens/AllQuizScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          ...styles.tabBar,
          ...Platform.select({
            android: {
              elevation: 10,
            },
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.05,
              shadowRadius: 10,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          paddingBottom: 4,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'AllCardsScreen':
              iconName = focused ? 'albums' : 'albums-outline';
              break;
            case 'SemesterHub':
              iconName = focused ? 'school' : 'school-outline';
              break;
            case 'AllNotesScreen':
              iconName = focused ? 'document-text' : 'document-text-outline';
              break;
            case 'AllQuizScreen':
              iconName = focused ? 'checkbox' : 'checkbox-outline';
              break;
            case 'ProfileScreen':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="AllNotesScreen" component={AllNotesScreen} options={{ tabBarLabel: 'Notes' }} />
      <Tab.Screen name="SemesterHub" component={SemesterHub} options={{ tabBarLabel: 'Semester Hub' }} />
      <Tab.Screen name="AllCardsScreen" component={AllCardsScreen} options={{ tabBarLabel: 'Flashcards' }} />
      <Tab.Screen name="AllQuizScreen" component={AllQuizScreen} options={{ tabBarLabel: 'Quizzes' }} />
      
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    paddingBottom: 6,
    paddingTop: 6,
  },
});