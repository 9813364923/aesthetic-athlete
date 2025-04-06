import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Pedometer } from 'expo-sensors';
import API from '@/utils/api';

export default function HomeScreen() {
  const [isAvailable, setIsAvailable] = useState('checking');
  const [stepCount, setStepCount] = useState(0);

  // Check pedometer availability and watch steps
  useEffect(() => {
    Pedometer.isAvailableAsync().then(
      (result) => setIsAvailable(result ? 'available' : 'not available'),
      (error) => setIsAvailable('error: ' + error)
    );

    const subscription = Pedometer.watchStepCount((result) => {
      setStepCount(result.steps);
    });

    return () => subscription.remove();
  }, []);

  // Sync steps to backend whenever stepCount changes
  useEffect(() => {
    if (stepCount > 0) {
      const sendStepsToServer = async () => {
        try {
          const res = await API.post('/user/steps', { steps: stepCount });
          console.log(' Step sync success:', res.data);
        } catch (error) {
          console.error(' Failed to sync steps:', error);
        }
      };
      sendStepsToServer();
    }
  }, [stepCount]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}> Real-Time Step Tracker</Text>
      <Text style={styles.info}> Pedometer: {isAvailable}</Text>
      <Text style={styles.steps}> Steps: {stepCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#007AFF',
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  steps: {
    fontSize: 22,
    fontWeight: '600',
    color: '#22c55e',
  },
});
