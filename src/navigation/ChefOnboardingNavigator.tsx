import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingHubScreen from '../screens/chef/OnboardingHubScreen';
import ProfileSetupScreen from '../screens/chef/ProfileSetupScreen';

export type ChefOnboardingParamList = {
  OnboardingHub: undefined;
  ProfileSetup: undefined;
  PhotoUpload: undefined;
  MenuSetup: undefined;
  AvailabilitySetup: undefined;
};

const Stack = createNativeStackNavigator<ChefOnboardingParamList>();

export default function ChefOnboardingNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OnboardingHub"
        component={OnboardingHubScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileSetup"
        component={ProfileSetupScreen}
        options={{ title: 'Profile Details', headerBackTitle: 'Back' }}
      />
    </Stack.Navigator>
  );
}
