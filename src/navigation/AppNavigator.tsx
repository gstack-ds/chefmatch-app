import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/use-auth';
import { ChefOnboardingProvider } from '../hooks/use-chef-onboarding';
import ChefOnboardingNavigator from './ChefOnboardingNavigator';
import ConsumerTabNavigator from './ConsumerTabNavigator';

export type AppStackParamList = {
  ConsumerTabs: undefined;
  ChefOnboarding: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

function ChefOnboardingWithProvider() {
  return (
    <ChefOnboardingProvider>
      <ChefOnboardingNavigator />
    </ChefOnboardingProvider>
  );
}

export default function AppNavigator() {
  const { user } = useAuth();
  const isChef = user?.role === 'chef';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isChef ? (
        <Stack.Screen name="ChefOnboarding" component={ChefOnboardingWithProvider} />
      ) : (
        <Stack.Screen name="ConsumerTabs" component={ConsumerTabNavigator} />
      )}
    </Stack.Navigator>
  );
}
