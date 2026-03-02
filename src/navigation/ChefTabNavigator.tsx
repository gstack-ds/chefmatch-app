import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlaceholderChefHomeScreen from '../screens/chef/PlaceholderChefHomeScreen';
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
        component={PlaceholderChefHomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => undefined,
        }}
      />
      <Tab.Screen
        name="ChefBookingsTab"
        component={ChefBookingsStackNavigator}
        options={{
          tabBarLabel: 'Bookings',
          tabBarIcon: () => undefined,
        }}
      />
      <Tab.Screen
        name="ChefMessagesTab"
        component={MessagingStackNavigator}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: () => undefined,
        }}
      />
    </Tab.Navigator>
  );
}
