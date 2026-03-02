import 'react-native-url-polyfill/auto';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { registerRootComponent } from 'expo';
import { AuthProvider } from './hooks/use-auth';
import RootNavigator from './navigation/RootNavigator';

function App() {
  return (
    <AuthProvider>
      <RootNavigator />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}

registerRootComponent(App);
