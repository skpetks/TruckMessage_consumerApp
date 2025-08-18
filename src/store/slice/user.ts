import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types/auth';

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set user data and mark as authenticated
    setUser: (state, action: PayloadAction<{ user: User; token: string; refreshToken: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null;
    },
    
    // Clear user data and mark as not authenticated
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Set error
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Update user profile
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    
    // Refresh token
    refreshToken: (state, action: PayloadAction<{ token: string; refreshToken: string }>) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
  },
});

// Export actions
export const {
  setUser,
  clearUser,
  setLoading,
  setError,
  clearError,
  updateUserProfile,
  refreshToken,
} = userSlice.actions;

// Export selectors
export const selectUser = (state: { user: AuthState }) => state.user.user;
export const selectToken = (state: { user: AuthState }) => state.user.token;
export const selectIsAuthenticated = (state: { user: AuthState }) => state.user.isAuthenticated;
export const selectIsLoading = (state: { user: AuthState }) => state.user.isLoading;
export const selectError = (state: { user: AuthState }) => state.user.error;

// Export reducer
export default userSlice.reducer;
