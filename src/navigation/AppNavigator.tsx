import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainLayout } from '../components/layout/MainLayout';
import { Search } from '../components/search/Search';
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
      <Stack.Screen name="Search" component={Search} />
      {/* Add more screens here as needed */}
    </Stack.Navigator>
  );
} 