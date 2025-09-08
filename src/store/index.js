import { configureStore } from '@reduxjs/toolkit';
import kycReducer from './slices/kycSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    kyc: kycReducer,
    ui: uiReducer,
  },
});
