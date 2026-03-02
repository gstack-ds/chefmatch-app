import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PlaceholderHomeScreen from '../screens/shared/PlaceholderHomeScreen';

export type AppStackParamList = {
  Home: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={PlaceholderHomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
