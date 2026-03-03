import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DiscoveryProvider } from '../hooks/use-discovery';
import DiscoveryStackNavigator from './DiscoveryStackNavigator';
import MessagingStackNavigator from './MessagingStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';

export type ConsumerTabParamList = {
  DiscoveryTab: undefined;
  MessagesTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<ConsumerTabParamList>();

function DiscoveryTabWithProvider() {
  return (
    <DiscoveryProvider>
      <DiscoveryStackNavigator />
    </DiscoveryProvider>
  );
}

export default function ConsumerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#f97316',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          borderTopColor: '#e5e7eb',
        },
      }}
    >
      <Tab.Screen
        name="DiscoveryTab"
        component={DiscoveryTabWithProvider}
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>{'\u{1F50D}'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="MessagesTab"
        component={MessagingStackNavigator}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>{'\u{1F4AC}'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>{'\u{1F464}'}</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
