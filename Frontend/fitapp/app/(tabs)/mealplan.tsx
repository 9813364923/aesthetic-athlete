import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Button,
} from 'react-native';
import API from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';

type Meal = {
  time: string;
  food: string;
};

export default function MealPlanScreen() {
  const [loading, setLoading] = useState(true);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [completed, setCompleted] = useState<boolean[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await API.get('/user/meal-plan');
        const fetchedMeals = res.data.meals || [];
        setMeals(fetchedMeals);
        setCompleted(new Array(fetchedMeals.length).fill(false));
      } catch (err) {
        console.error('Meal fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  const toggleComplete = (index: number) => {
    const updated = [...completed];
    updated[index] = !updated[index];
    setCompleted(updated);
  };

  const allDone = completed.every((c) => c);

  const handleSubmitDay = async () => {
    try {
      await API.post('/user/complete-day', {
        type: 'meal',
        completed: meals,
      });
      setSubmitted(true);
      alert('🎉 Meal Day Submitted!');
    } catch (err) {
      console.error(' Meal Day Submit error:', err);
      alert('Submission failed.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Your Meal Plan</Text>
      <FlatList
        data={meals}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.card, completed[index] && styles.cardDone]}
            onPress={() => toggleComplete(index)}
          >
            <Text style={styles.text}>{item.time}: {item.food}</Text>
            <Ionicons
              name={completed[index] ? 'checkmark-circle' : 'ellipse-outline'}
              size={24}
              color={completed[index] ? 'green' : '#ccc'}
            />
          </TouchableOpacity>
        )}
      />

      {allDone && !submitted && (
        <Button title=" Submit Day" onPress={handleSubmitDay} color="#28a745" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 10,
  },
  cardDone: {
    backgroundColor: '#d4edda',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});
