import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';
import API from '@/utils/api';

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [tokenExists, setTokenExists] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          setTokenExists(false);
          setChecking(false);
          return;
        }

        setTokenExists(true);

        const res = await API.get('/user/profile');
        const user = res.data;

        if (user?.preferences?.goal) {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding/step1-goal');
        }
      } catch (err) {
        console.error('Auth check failed:', err.message);
        await AsyncStorage.removeItem('token');
        setTokenExists(false);
      } finally {
        setChecking(false);
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  if (checking) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.text}>Checking login status...</Text>
      </View>
    );
  }

  if (!tokenExists) {
    return (
      <View style={styles.container}>
        <Video
          source={require('../assets/videos/v1.mp4')} // Replace with your actual path
          style={StyleSheet.absoluteFill}
          shouldPlay
          isLooping
          resizeMode="cover"
        />

        <View style={styles.overlay}>
          <Animated.Text style={[styles.promoText, { opacity: fadeAnim }]}>
            #1 Fitness App – Trusted by Athletes 💪
          </Animated.Text>

          <Text style={styles.title}>Welcome to Aesthetic Athlete!</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/signup')}
          >
            <Text style={styles.buttonText}>Let's Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={styles.loginLink}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
    marginTop: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  promoText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#ff6347',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  loginText: {
    color: '#fff',
    fontSize: 14,
  },
  loginLink: {
    color: '#ff6347',
    fontWeight: 'bold',
  },
});
