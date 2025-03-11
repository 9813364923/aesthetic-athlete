import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  // Font loading state
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Onboarding state
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  // Check AsyncStorage for onboarding completion
  const checkOnboarding = useCallback(async () => {
    try {
      const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');
      setIsOnboarded(!!hasOnboarded); // true or false
    } catch (error) {
      console.error('Error reading onboarding status:', error);
      setIsOnboarded(false); // fallback
    }
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    checkOnboarding();
  }, [checkOnboarding]);

  // Still loading fonts or checking onboarding status
  if (!fontsLoaded || isOnboarded === null) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName={isOnboarded ? '(tabs)' : 'onboarding'}>
        
        {/* Onboarding Stack */}
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        
        {/* Main Tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Not Found Page */}
        <Stack.Screen name="+not-found" />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
