// src/services/apiClient.js
import axios from 'axios';

// Prefer an env var; fallback is your Azure base URL for convenience. [1]
const API_BASE_URL =
  import.meta.env.VITE_KYC_BASE_URL ||
  'https://kycv1-ashjgwdweacxcrfn.canadacentral-01.azurewebsites.net';

// Create a single instance to share headers/interceptors project‑wide. [1]
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json', // do not set multipart here; let Axios handle it per request. [3]
  },
  withCredentials: false,
});

// Request interceptor: inject bearer token if available. [2]
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: centralize 401 handling; keep errors as rejections. [2]
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('authToken');
      // Optional: redirect to login route here if your app needs it. [2]
    }
    return Promise.reject(error);
  }
);

export default apiClient;
