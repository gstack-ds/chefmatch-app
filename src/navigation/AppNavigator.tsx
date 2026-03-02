import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/use-auth';
import { ChefOnboardingProvider, useChefOnboarding } from '../hooks/use-chef-onboarding';
import ChefOnboardingNavigator from './ChefOnboardingNavigator';
import ConsumerTabNavigator from './ConsumerTabNavigator';
import PlaceholderChefHomeScreen from '../screens/chef/PlaceholderChefHomeScreen';

export type AppStackParamList = {
  ConsumerTabs: undefined;
  ChefFlow: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

function ChefRouter() {
  const { chefProfile, isLoading } = useChefOnboarding();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (chefProfile?.isLive) {
    return <PlaceholderChefHomeScreen />;
  }

  return <ChefOnboardingNavigator />;
}

function ChefFlowWithProvider() {
  return (
    <ChefOnboardingProvider>
      <ChefRouter />
    </ChefOnboardingProvider>
  );
}

export default function AppNavigator() {
  const { user } = useAuth();
  const isChef = user?.role === 'chef';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isChef ? (
        <Stack.Screen name="ChefFlow" component={ChefFlowWithProvider} />
      ) : (
        <Stack.Screen name="ConsumerTabs" component={ConsumerTabNavigator} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
