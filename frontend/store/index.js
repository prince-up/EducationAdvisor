import { configureStore } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

// Create a simple app slice with initial state
const appSlice = createSlice({
  name: 'app',
  initialState: {
    loading: false,
    error: null
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

// Create a store with the reducer
const store = configureStore({
  reducer: {
    app: appSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const { setLoading, setError } = appSlice.actions;
export default store;