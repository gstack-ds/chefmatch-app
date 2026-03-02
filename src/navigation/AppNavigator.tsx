import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/use-auth';
import { ChefOnboardingProvider } from '../hooks/use-chef-onboarding';
import PlaceholderHomeScreen from '../screens/shared/PlaceholderHomeScreen';
import ChefOnboardingNavigator from './ChefOnboardingNavigator';

export type AppStackParamList = {
  Home: undefined;
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
        <Stack.Screen name="Home" component={PlaceholderHomeScreen} />
      )}
    </Stack.Navigator>
  );
}
