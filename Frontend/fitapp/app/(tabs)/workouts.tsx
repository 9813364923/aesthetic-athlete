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

type WorkoutItem = {
  day: string;
  type: string;
  duration: string;
};

export default function Workouts() {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<WorkoutItem[]>([]);
  const [completed, setCompleted] = useState<boolean[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await API.get('/user/workout-plan');
        const fetchedPlan = res.data.plan || [];
        setPlan(fetchedPlan);
        setCompleted(new Array(fetchedPlan.length).fill(false));
      } catch (err) {
        console.error('Workout fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
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
        type: 'workout',
        completed: plan,
      });
      setSubmitted(true);
      alert('🎉 Day submitted successfully!');
    } catch (err) {
      console.error(' Submit error:', err);
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
      <Text style={styles.title}>🏋️ Your Workout Plan</Text>
      <FlatList
        data={plan}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.card, completed[index] && styles.cardDone]}
            onPress={() => toggleComplete(index)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.text}> {item.day}</Text>
              <Text style={styles.text}> {item.type}</Text>
              <Text style={styles.text}>⏱ {item.duration}</Text>
            </View>
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
