import axios from 'axios';
import { authService } from './auth';

const API_URL = process.env.REACT_APP_API_URL || 'https://ehpad-nfc-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Authentification
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
  },

  // Résidents
  residents: {
    getAll: () => api.get('/residents'),
    getById: (id) => api.get(`/residents/${id}`),
    create: (data) => api.post('/residents', data),
    update: (id, data) => api.put(`/residents/${id}`, data),
    delete: (id) => api.delete(`/residents/${id}`),
  },

  // Badges NFC
  nfc: {
    getAll: () => api.get('/nfc/badges'),
    getByResident: (residentId) => api.get(`/nfc/badges/resident/${residentId}`),
    scan: (badgeUid) => api.post('/nfc/scan', { badgeUid }),
    assign: (data) => api.post('/nfc/badges', data),
  },

  // Dossiers médicaux
  medical: {
    getByResident: (residentId) => api.get(`/medical/resident/${residentId}`),
    create: (data) => api.post('/medical', data),
    update: (id, data) => api.put(`/medical/${id}`, data),
  },
};

export default api;
