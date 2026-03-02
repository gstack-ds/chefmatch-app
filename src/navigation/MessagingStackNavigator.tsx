import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConversationListScreen from '../screens/shared/ConversationListScreen';
import ChatScreen from '../screens/shared/ChatScreen';

export type MessagingStackParamList = {
  ConversationList: undefined;
  Chat: { conversationId: string; otherUserName: string };
};

const Stack = createNativeStackNavigator<MessagingStackParamList>();

export default function MessagingStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ConversationList"
        component={ConversationListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({
          title: route.params.otherUserName,
          headerBackTitle: 'Back',
        })}
      />
    </Stack.Navigator>
  );
}
