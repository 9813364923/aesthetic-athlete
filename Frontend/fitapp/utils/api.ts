import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: 'https://0abb-160-30-132-223.ngrok-free.app', 
  timeout: 5000,
});


API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(" Sending token:", token); //  Add this to debug
  } else {
    console.log(" No token found in AsyncStorage");
  }
  return config;
});

export default API;
