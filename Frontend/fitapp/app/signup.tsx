import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import API from '../utils/api';
import { Ionicons } from '@expo/vector-icons';

const SignupScreen = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('All fields are required!');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/auth/signup', {
        name,
        email,
        password,
      });

      Alert.alert('Account Created', 'Let’s set your fitness goals!');
      router.push('/onboarding/step1-goal');
    } catch (err: any) {
      console.log('Signup error:', err.response?.data || err.message);
      Alert.alert(
        'Signup Failed',
        err.response?.data?.error || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.header}>Create Your Fitness Account</Text>
      <Text style={styles.subText}>We’ll personalize your workouts after signup!</Text>

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholderTextColor="#999"
      />

      <TextInput
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.passwordInput}
          secureTextEntry={!showPassword}
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={22}
            color="#777"
          />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up & Continue</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.loginLink}>
          Already have an account? <Text style={{ fontWeight: 'bold' }}>Sign In</Text>
        </Text>
      </TouchableOpacity>

      <Text style={styles.terms}>
        By signing up, you agree to our{' '}
        <Text style={{ textDecorationLine: 'underline' }}>Terms</Text> &{' '}
        <Text style={{ textDecorationLine: 'underline' }}>Privacy Policy</Text>.
      </Text>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#222',
    textAlign: 'center',
  },
  subText: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 20,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    height: 50,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  loginLink: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  terms: {
    marginTop: 16,
    textAlign: 'center',
    color: '#aaa',
    fontSize: 12,
  },
});

export default SignupScreen;
