import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const kycApi = {
  uploadDocument: async (formData) => {
    const response = await apiClient.post('/kyc/upload-document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadSelfie: async (formData) => {
    const response = await apiClient.post('/kyc/upload-selfie', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  submitKyc: async (kycData) => {
    const response = await apiClient.post('/kyc/submit', kycData);
    return response.data;
  },

  getVerificationStatus: async (sessionId) => {
    const response = await apiClient.get(`/kyc/status/${sessionId}`);
    return response.data;
  },
};

export default apiClient;
