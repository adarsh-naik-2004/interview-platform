import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
    response => response,
    error => {
      // Skip redirect for auth check requests
      if (error.config.url.includes('/auth/check')) {
        return Promise.reject(error);
      }
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location = '/login';
      }
      return Promise.reject(error);
    }
  );

export default api;