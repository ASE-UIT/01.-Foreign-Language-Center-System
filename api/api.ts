import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';
// Tạo instance của axios
const api = axios.create({
  baseURL: 'http://10.0.2.2:8080',
  timeout: 10000,
});

// Tự động gắn token vào mỗi request
// api.interceptors.request.use(async (config) => {
//   const token = await AsyncStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

export default api;
