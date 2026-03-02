import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingHubScreen from '../screens/chef/OnboardingHubScreen';
import ProfileSetupScreen from '../screens/chef/ProfileSetupScreen';
import PhotoUploadScreen from '../screens/chef/PhotoUploadScreen';
import MenuSetupScreen from '../screens/chef/MenuSetupScreen';
import AvailabilitySetupScreen from '../screens/chef/AvailabilitySetupScreen';

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
      <Stack.Screen
        name="PhotoUpload"
        component={PhotoUploadScreen}
        options={{ title: 'Photos', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="MenuSetup"
        component={MenuSetupScreen}
        options={{ title: 'Menu', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="AvailabilitySetup"
        component={AvailabilitySetupScreen}
        options={{ title: 'Availability', headerBackTitle: 'Back' }}
      />
    </Stack.Navigator>
  );
}
