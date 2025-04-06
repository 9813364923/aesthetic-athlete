// app/onboarding/step4-diet.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const diets = ['Vegetarian', 'Keto', 'Balanced'];

export default function Step4Diet() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [diet, setDiet] = useState('');
  const [allergies, setAllergies] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diet Preferences</Text>

      {diets.map((d) => (
        <TouchableOpacity
          key={d}
          style={[styles.option, diet === d && styles.selectedOption]}
          onPress={() => setDiet(d)}
        >
          <Text style={styles.optionText}>{d}</Text>
        </TouchableOpacity>
      ))}

      <TextInput
        placeholder="Any allergies?"
        value={allergies}
        onChangeText={setAllergies}
        style={styles.input}
      />

      <Button
        title="Finish"
        onPress={() =>
          router.push({
            pathname: '/onboarding/summary',
            params: {
              ...params,
              diet,
              allergies,
            },
          })
        }
        disabled={!diet}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  option: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: '#eee',
  },
  selectedOption: { backgroundColor: '#007AFF' },
  optionText: { textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginVertical: 15,
    borderRadius: 8,
  },
});
