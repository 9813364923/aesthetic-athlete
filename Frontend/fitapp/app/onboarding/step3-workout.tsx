// app/onboarding/step3-workout.tsx
import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const workoutTypes = ['Cardio', 'Strength', 'Yoga', 'HIIT'];
const experienceLevels = ['Beginner', 'Intermediate', 'Advanced'];

export default function Step3Workout() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [workoutType, setWorkoutType] = React.useState('');
  const [experience, setExperience] = React.useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Preference</Text>

      <Text style={styles.subtitle}>Type</Text>
      {workoutTypes.map((type) => (
        <TouchableOpacity
          key={type}
          style={[styles.option, workoutType === type && styles.selectedOption]}
          onPress={() => setWorkoutType(type)}
        >
          <Text style={styles.optionText}>{type}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.subtitle}>Experience</Text>
      {experienceLevels.map((level) => (
        <TouchableOpacity
          key={level}
          style={[styles.option, experience === level && styles.selectedOption]}
          onPress={() => setExperience(level)}
        >
          <Text style={styles.optionText}>{level}</Text>
        </TouchableOpacity>
      ))}

      <Button
        title="Next"
        onPress={() =>
          router.push({
            pathname: '/onboarding/step4-diet',
            params: {
              ...params,
              workoutType,
              experience,
            },
          })
        }
        disabled={!workoutType || !experience}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  subtitle: { fontSize: 18, marginTop: 20, marginBottom: 10 },
  option: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: '#eee',
  },
  selectedOption: {
    backgroundColor: '#007AFF',
  },
  optionText: { textAlign: 'center' },
});
