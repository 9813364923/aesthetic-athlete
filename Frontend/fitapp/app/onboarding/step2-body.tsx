import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

type SelectButtonProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

const SelectButton = ({ label, selected, onPress }: SelectButtonProps) => (
  <Pressable
    onPress={onPress}
    style={[
      styles.selectButton,
      selected && styles.selectButtonSelected,
    ]}
  >
    <Text
      style={[
        styles.selectButtonText,
        selected && styles.selectButtonTextSelected,
      ]}
    >
      {label}
    </Text>
  </Pressable>
);

export default function Step2Body() {
  const { goal } = useLocalSearchParams();
  const router = useRouter();

  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const ageOptions = [18, 19, 20, 21, 22, 23, 24];
  const heightOptions = [160, 165, 170, 175, 180];
  const weightOptions = [50, 55, 60, 65, 70];

  const isValid = age && height && weight;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Tell us about you</Text>

        {/* Age */}
        <Text style={styles.label}>Age</Text>
        <View style={styles.optionRow}>
          {ageOptions.map((a) => (
            <SelectButton
              key={a}
              label={a.toString()}
              selected={age === a.toString()}
              onPress={() => setAge(a.toString())}
            />
          ))}
        </View>

        {/* Height */}
        <Text style={styles.label}>Height (cm)</Text>
        <View style={styles.optionRow}>
          {heightOptions.map((h) => (
            <SelectButton
              key={h}
              label={h.toString()}
              selected={height === h.toString()}
              onPress={() => setHeight(h.toString())}
            />
          ))}
        </View>

        {/* Weight */}
        <Text style={styles.label}>Weight (kg)</Text>
        <View style={styles.optionRow}>
          {weightOptions.map((w) => (
            <SelectButton
              key={w}
              label={w.toString()}
              selected={weight === w.toString()}
              onPress={() => setWeight(w.toString())}
            />
          ))}
        </View>

        <Pressable
          style={[styles.button, { backgroundColor: isValid ? '#007bff' : '#ccc' }]}
          disabled={!isValid}
          onPress={() =>
            router.push({
              pathname: '/onboarding/step3-workout',
              params: { goal, age, height, weight },
            })
          }
        >
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { padding: 24 },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  selectButton: {
    borderWidth: 1,
    borderColor: '#aaa',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    marginRight: 10,
    marginBottom: 10,
  },
  selectButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  selectButtonText: {
    fontSize: 16,
    color: '#333',
  },
  selectButtonTextSelected: {
    color: '#fff',
  },
  button: {
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
