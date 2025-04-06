import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('onboardingComplete');
          router.replace('/login'); // Redirect to login screen
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Button title="Logout" color="#EF4444" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
});
