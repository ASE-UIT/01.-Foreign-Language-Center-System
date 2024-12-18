import axios from 'axios';
import { Platform } from 'react-native';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';
// Tạo instance của axios
const api = axios.create({
  baseURL: 'http://10.0.2.2:8080',
  timeout: 10000,
});


export default api;
