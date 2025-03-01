import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainLayout } from '../components/layout/MainLayout';
import type { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={MainLayout} />
      {/* Add more screens here as needed */}
    </Stack.Navigator>
  );
} 