import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentStep: 0,
  documentType: null,
  country: null,
  documentImage: null,
  selfieImage: null,
  isComplete: false,
  verificationStatus: 'pending',
};

export const kycSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    setDocumentType: (state, action) => {
      state.documentType = action.payload;
    },
    setCountry: (state, action) => {
      state.country = action.payload;
    },
    setDocumentImage: (state, action) => {
      state.documentImage = action.payload;
    },
    setSelfieImage: (state, action) => {
      state.selfieImage = action.payload;
    },
    nextStep: (state) => {
      state.currentStep += 1;
    },
    previousStep: (state) => {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
      }
    },
    resetKyc: (state) => {
      return initialState;
    },
    setVerificationStatus: (state, action) => {
      state.verificationStatus = action.payload;
    },
  },
});

export const {
  setCurrentStep,
  setDocumentType,
  setCountry,
  setDocumentImage,
  setSelfieImage,
  nextStep,
  previousStep,
  resetKyc,
  setVerificationStatus,
} = kycSlice.actions;

export default kycSlice.reducer;
