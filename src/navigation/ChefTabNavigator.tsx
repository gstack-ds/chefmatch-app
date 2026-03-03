import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChefDashboardScreen from '../screens/chef/ChefDashboardScreen';
import ChefBookingsScreen from '../screens/chef/ChefBookingsScreen';
import ChefBookingDetailScreen from '../screens/chef/ChefBookingDetailScreen';
import WriteReviewScreen from '../screens/shared/WriteReviewScreen';
import MessagingStackNavigator from './MessagingStackNavigator';

export type ChefBookingsStackParamList = {
  ChefBookings: undefined;
  ChefBookingDetail: { bookingId: string };
  WriteReview: { bookingId: string; reviewerId: string; revieweeId: string; revieweeName: string };
};

export type ChefTabParamList = {
  ChefDashboardTab: undefined;
  ChefBookingsTab: undefined;
  ChefMessagesTab: undefined;
};

const Tab = createBottomTabNavigator<ChefTabParamList>();
const BookingsStack = createNativeStackNavigator<ChefBookingsStackParamList>();

function ChefBookingsStackNavigator() {
  return (
    <BookingsStack.Navigator>
      <BookingsStack.Screen
        name="ChefBookings"
        component={ChefBookingsScreen}
        options={{ headerShown: false }}
      />
      <BookingsStack.Screen
        name="ChefBookingDetail"
        component={ChefBookingDetailScreen}
        options={{ title: 'Booking Details', headerBackTitle: 'Back' }}
      />
      <BookingsStack.Screen
        name="WriteReview"
        component={WriteReviewScreen}
        options={{ title: 'Write Review', headerBackTitle: 'Back' }}
      />
    </BookingsStack.Navigator>
  );
}

export default function ChefTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          borderTopColor: '#e5e7eb',
        },
      }}
    >
      <Tab.Screen
        name="ChefDashboardTab"
        component={ChefDashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Text style={{ fontSize: size, color }}>{'\u{1F3E0}'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="ChefBookingsTab"
        component={ChefBookingsStackNavigator}
        options={{
          tabBarLabel: 'Bookings',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Text style={{ fontSize: size, color }}>{'\u{1F4C5}'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="ChefMessagesTab"
        component={MessagingStackNavigator}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Text style={{ fontSize: size, color }}>{'\u{1F4AC}'}</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
