import axios from "axios";

// In dev, Vite proxy handles /api/* → localhost:5000
// In prod, VITE_API_URL should point to the Render backend (e.g. https://fundsroom-backend.onrender.com)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
