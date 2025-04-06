import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import API from '../utils/api';

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  //  Handle login process
  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Please fill all fields');
    }

    setLoading(true);

    try {
      console.log("📡 Sending login request to backend...");

      //  1. Login request
      const res = await API.post('/auth/login', { email, password });

      console.log(" Login success:", res.data);

      const { token } = res.data;

      //  2. Save token to AsyncStorage
      await AsyncStorage.setItem('token', token);
      console.log(" Token saved to AsyncStorage:", token);

      //  3. Fetch user profile with token
      const profile = await API.get('/user/profile');
      console.log(" Profile fetched:", profile.data);

      //  4. Redirect user based on profile
      if (profile?.data?.preferences?.goal) {
        router.replace('/(tabs)'); // go to dashboard
      } else {
        router.replace('/onboarding/step1-goal'); // go to onboarding
      }

    } catch (err: any) {
      console.log(" Login failed:", err.message, err.response?.data);
      Alert.alert('Login Failed', err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  //  Check backend connection when component loads
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await API.get('/ping');
        console.log("Backend is reachable");
      } catch (err: any) {
        Alert.alert('Backend Error', err.message);
      }
    };

    checkBackend();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/i1.jpg')}
      style={styles.background}
      imageStyle={{ opacity: 0.85 }}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <Button title="Login" onPress={handleLogin} />
          )}

          <TouchableOpacity onPress={() => router.replace('/signup')}>
            <Text style={styles.signupText}>
              Don't have an account?{' '}
              <Text style={styles.signupLink}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
  },
  container: {
    padding: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  signupText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
    color: '#fff',
  },
  signupLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default LoginScreen;
