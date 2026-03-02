import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConsumerProfileScreen from '../screens/consumer/ConsumerProfileScreen';
import BookingDetailScreen from '../screens/consumer/BookingDetailScreen';
import WriteReviewScreen from '../screens/shared/WriteReviewScreen';

export type ProfileStackParamList = {
  ConsumerProfile: undefined;
  BookingDetail: { bookingId: string };
  WriteReview: { bookingId: string; reviewerId: string; revieweeId: string; revieweeName: string };
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ConsumerProfile"
        component={ConsumerProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookingDetail"
        component={BookingDetailScreen}
        options={{ title: 'Booking Details', headerBackTitle: 'Back' }}
      />
      <Stack.Screen
        name="WriteReview"
        component={WriteReviewScreen}
        options={{ title: 'Write Review', headerBackTitle: 'Back' }}
      />
    </Stack.Navigator>
  );
}
