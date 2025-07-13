// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './navigation/StackNavigator'; // Import your StackNavigator
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-gesture-handler';


export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
