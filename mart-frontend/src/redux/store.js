import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
// Import other reducers as needed, for example:
// import storeReducer from './storeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers here, for example:
    // store: storeReducer,
  },
});

// Export the store's dispatch and getState functions
export const { dispatch, getState } = store;