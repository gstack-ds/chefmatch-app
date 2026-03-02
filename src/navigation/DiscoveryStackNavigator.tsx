import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DiscoverableChef } from '../models/types';
import DiscoveryFeedScreen from '../screens/consumer/DiscoveryFeedScreen';
import ChefDetailScreen from '../screens/consumer/ChefDetailScreen';

export type DiscoveryStackParamList = {
  DiscoveryFeed: undefined;
  ChefDetail: { chef: DiscoverableChef };
};

const Stack = createNativeStackNavigator<DiscoveryStackParamList>();

export default function DiscoveryStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DiscoveryFeed"
        component={DiscoveryFeedScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChefDetail"
        component={ChefDetailScreen}
        options={{
          title: 'Chef Profile',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
}
