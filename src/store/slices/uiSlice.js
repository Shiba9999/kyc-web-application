import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  error: null,
  cameraPermission: null,
  isCameraActive: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCameraPermission: (state, action) => {
      state.cameraPermission = action.payload;
    },
    setCameraActive: (state, action) => {
      state.isCameraActive = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setCameraPermission,
  setCameraActive,
} = uiSlice.actions;

export default uiSlice.reducer;
