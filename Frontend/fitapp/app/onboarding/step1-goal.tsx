// app/onboarding/step1-goal.tsx
import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const goals = ['Lose Weight', 'Build Muscle', 'Stay Fit'];

export default function Step1Goal() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = React.useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What's your fitness goal?</Text>
      {goals.map((goal) => (
        <TouchableOpacity
          key={goal}
          style={[
            styles.option,
            selectedGoal === goal && styles.selectedOption,
          ]}
          onPress={() => setSelectedGoal(goal)}
        >
          <Text style={styles.optionText}>{goal}</Text>
        </TouchableOpacity>
      ))}
      <Button
        title="Next"
        onPress={() => {
          if (selectedGoal) {
            router.push({
              pathname: '/onboarding/step2-body',
              params: { goal: selectedGoal },
            });
          }
        }}
        disabled={!selectedGoal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  option: {
    padding: 15,
    backgroundColor: '#eee',
    marginVertical: 10,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    textAlign: 'center',
    color: '#000',
  },
});
