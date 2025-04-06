import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Auth Screens */}
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />

        {/* Onboarding Flow */}
        <Stack.Screen name="onboarding/step1-goal" />
        <Stack.Screen name="onboarding/step2-body" />
        <Stack.Screen name="onboarding/step3-workout" />
        <Stack.Screen name="onboarding/step4-diet" />
        <Stack.Screen name="onboarding/summary" />

      
      </Stack>

      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
