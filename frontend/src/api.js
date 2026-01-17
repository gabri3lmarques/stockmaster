import axios from 'axios';

const api = axios.create({
  baseURL: 'https://stockmaster-web-api-cph9fpcsbnfhe3gs.canadacentral-01.azurewebsites.net/api' // CONFIRME A PORTA DA SUA API AQUI
});

// Interceptor to add the JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('stockmaster_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;