import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import API from '@/utils/api';

export default function SummaryScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    goal,
    age,
    height,
    weight,
    workoutType,
    experience,
    diet,
    allergies,
  } = useLocalSearchParams();

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const payload = {
        goal,
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
        workoutType,
        experience,
        diet,
        allergies,
      };

      console.log(' Submitting payload:', payload);

      //  Send to correct backend route
      await API.post('/user/onboarding', payload);

      Alert.alert(' Success', 'Your preferences have been saved!');
      router.replace('/(tabs)');
    } catch (error) {
      console.log(' Error submitting onboarding data:', error);
      Alert.alert('Submission Failed', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const bmr = 10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age) + 5;

let dailyCalories = 0;

if (goal === 'Lose Weight') {
  dailyCalories = Math.round(bmr * 1.2 - 300);
} else if (goal === 'Build Muscle') {
  dailyCalories = Math.round(bmr * 1.55 + 250);
} else {
  dailyCalories = Math.round(bmr * 1.3);
}

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Summary</Text>
      <Text> Goal: {goal}</Text>
      <Text> Age: {age}</Text>
      <Text> Height: {height} cm</Text>
      <Text> Weight: {weight} kg</Text>
      <Text> Workout Type: {workoutType}</Text>
      <Text> Experience: {experience}</Text>
      <Text> Diet: {diet}</Text>
      <Text> Allergies: {allergies || 'None'}</Text>
      <Text> Your Target Daily Calories: {dailyCalories} kcal</Text>


      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <Button title="Complete Onboarding" onPress={handleSubmit} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
