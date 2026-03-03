import 'react-native-url-polyfill/auto';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { AuthProvider } from './hooks/use-auth';
import RootNavigator from './navigation/RootNavigator';

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

registerRootComponent(App);
