import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from '../screens/Dashboard';
import DeckDetailScreen from '../screens/DeckDetailScreen';
import EchoStudyLogin from '../screens/EchoStudyLogin';
import FlashcardScreen from '../screens/FlashcardScreen'; // ✅ Add this if not already
import NotesScreen from '../screens/NotesScreen'; // ✅ Make sure the path is correct
import AllNotesScreen from '../screens/AllNotesScreen';
import AllCardsScreen from '../screens/AllCardsScreen';
import AllQuizScreen from '../screens/AllQuizScreen';
import SemesterHub from '../screens/SemesterHub';
import ProfileScreen from '../screens/ProfileScreen';
import StatsScreen from '../screens/StatsScreen';
import ClassScreen from '../screens/ClassScreen';
import QuizTakingScreen from '../screens/QuizTakingScreen';
import NotebookDetailsScreen from '../screens/NotebookDetailsScreen';
import QuizResultsScreen from '../screens/QuizResultsScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ClassSetupScreen from '../screens/Onboarding/ClassSetupScreen';
import StudyGoalScreen from '../screens/Onboarding/StudyGoalScreen';
import InterestToneScreen from '../screens/Onboarding/InterestToneScreen';
import BottomTabs from './BottomTabs';
const Stack = createStackNavigator();


export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
  <Stack.Screen name="Login" component={EchoStudyLogin} />
  
  
  
  {/* Main app with tab bar */}
  <Stack.Screen name="MainApp" component={BottomTabs} />

  {/* Deep screens */}
  <Stack.Screen name="InterestToneScreen" component={InterestToneScreen} />
  <Stack.Screen name="StudyGoalScreen" component={StudyGoalScreen} />
  <Stack.Screen name="Dashboard" component={Dashboard} /> 
  <Stack.Screen name="ClassSetupScreen" component={ClassSetupScreen} />
  <Stack.Screen name="QuizResults" component={QuizResultsScreen} />
  <Stack.Screen name="DeckDetailScreen" component={DeckDetailScreen} />
  <Stack.Screen name="FlashcardScreen" component={FlashcardScreen} />
  <Stack.Screen name="NotesScreen" component={NotesScreen} />
  <Stack.Screen name="SemesterHub" component={SemesterHub} />
  <Stack.Screen name="StatsScreen" component={StatsScreen} />
  <Stack.Screen name="ClassScreen" component={ClassScreen} />
  <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
  <Stack.Screen name="QuizTaking" component={QuizTakingScreen} />
  <Stack.Screen name="SignUp" component={SignUpScreen} />
  <Stack.Screen name="NotebookDetails" component={NotebookDetailsScreen} />
</Stack.Navigator>

  );
}
