import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DiscoverableChef } from '../models/types';
import DiscoveryFeedScreen from '../screens/consumer/DiscoveryFeedScreen';
import ChefDetailScreen from '../screens/consumer/ChefDetailScreen';
import BookingRequestScreen from '../screens/consumer/BookingRequestScreen';
import BookingDetailScreen from '../screens/consumer/BookingDetailScreen';
import WriteReviewScreen from '../screens/shared/WriteReviewScreen';
import ReviewListScreen from '../screens/shared/ReviewListScreen';

export type DiscoveryStackParamList = {
  DiscoveryFeed: undefined;
  ChefDetail: { chef: DiscoverableChef };
  BookingRequest: { chefId: string; chefName: string; conversationId: string | null };
  BookingDetail: { bookingId: string };
  WriteReview: { bookingId: string; reviewerId: string; revieweeId: string; revieweeName: string };
  ReviewList: { userId: string; userName: string };
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
      <Stack.Screen
        name="BookingRequest"
        component={BookingRequestScreen}
        options={{
          title: 'Request Booking',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="BookingDetail"
        component={BookingDetailScreen}
        options={{
          title: 'Booking Details',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="WriteReview"
        component={WriteReviewScreen}
        options={{
          title: 'Write Review',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="ReviewList"
        component={ReviewListScreen}
        options={{
          title: 'Reviews',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
}
