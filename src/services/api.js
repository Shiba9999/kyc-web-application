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

// Simulate API delay
const simulateDelay = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));

export const kycApi = {
  uploadDocument: async (documentBlob) => {
    console.log('📄 Uploading document...', documentBlob);
    
    // Simulate API call
    await simulateDelay(2000);
    
    // Create FormData for real API call (commented for now)
    // const formData = new FormData();
    // formData.append('document', documentBlob, 'document.jpg');
    // const response = await apiClient.post('/kyc/upload-document', formData, {
    //   headers: { 'Content-Type': 'multipart/form-data' }
    // });
    
    // Fake successful response
    const fakeResponse = {
      success: true,
      message: 'Document uploaded successfully',
      documentId: 'doc_' + Date.now(),
      extractedData: {
        documentType: 'national-id',
        firstName: 'John',
        lastName: 'Doe',
        documentNumber: 'ID123456789'
      }
    };
    
    console.log('✅ Document upload successful:', fakeResponse);
    return fakeResponse;
  },

  uploadSelfie: async (selfieBlob) => {
    console.log('🤳 Uploading selfie...', selfieBlob);
    
    // Simulate API call
    await simulateDelay(2000);
    
    // Create FormData for real API call (commented for now)
    // const formData = new FormData();
    // formData.append('selfie', selfieBlob, 'selfie.jpg');
    // const response = await apiClient.post('/kyc/upload-selfie', formData, {
    //   headers: { 'Content-Type': 'multipart/form-data' }
    // });
    
    // Fake successful response
    const fakeResponse = {
      success: true,
      message: 'Selfie uploaded successfully',
      selfieId: 'selfie_' + Date.now(),
      faceMatch: {
        confidence: 0.95,
        matched: true
      },
      livenessCheck: {
        passed: true,
        confidence: 0.92
      }
    };
    
    console.log('✅ Selfie upload successful:', fakeResponse);
    return fakeResponse;
  },

  submitKyc: async (kycData) => {
    console.log('🚀 Submitting KYC verification...', kycData);
    
    await simulateDelay(1500);
    
    // Fake successful response
    const fakeResponse = {
      success: true,
      verificationId: 'kyc_' + Date.now(),
      status: 'verified',
      message: 'KYC verification completed successfully'
    };
    
    console.log('✅ KYC verification successful:', fakeResponse);
    return fakeResponse;
  },

  getVerificationStatus: async (sessionId) => {
    const response = await apiClient.get(`/kyc/status/${sessionId}`);
    return response.data;
  },
};

export default apiClient;
