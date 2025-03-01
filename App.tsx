import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import styled from 'styled-components/native';
import { View, Text } from 'react-native';

const Container = styled(GestureHandlerRootView)`
  flex: 1;
`;

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ErrorText = styled.Text`
  color: red;
  text-align: center;
  margin-bottom: 10px;
`;

export default function App() {
  // Verify environment variables
  if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <ErrorContainer>
        <ErrorText>Missing Supabase configuration.</ErrorText>
        <Text>Please check your environment variables.</Text>
      </ErrorContainer>
    );
  }

  return (
    <Container>
      <StatusBar style="dark" />
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </Container>
  );
}
