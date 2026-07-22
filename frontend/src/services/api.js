
import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API Error:",
      (error.config?.baseURL || '') + (error.config?.url || ''),
      error.response?.status,
      error.response?.data
    );
    return Promise.reject(error);
  }
);

export default api;
