import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../../components/colors';

export interface ThemeState {
  isDark: boolean;
  theme: typeof lightTheme;
}

const initialState: ThemeState = {
  isDark: false,
  theme: lightTheme,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.isDark = action.payload;
      state.theme = action.payload ? darkTheme : lightTheme;
    },
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
      state.theme = state.isDark ? darkTheme : lightTheme;
    },
    loadTheme: (state, action: PayloadAction<boolean>) => {
      state.isDark = action.payload;
      state.theme = action.payload ? darkTheme : lightTheme;
    },
  },
});

// Export actions
export const { setTheme, toggleTheme, loadTheme } = themeSlice.actions;

// Async thunk to load theme from AsyncStorage
export const loadThemeFromStorage = () => async (dispatch: any) => {
  try {
    const savedTheme = await AsyncStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    dispatch(loadTheme(isDark));
  } catch (error) {
    console.error('Error loading theme:', error);
  }
};

// Async thunk to save theme to AsyncStorage
export const saveThemeToStorage = (isDark: boolean) => async (dispatch: any) => {
  try {
    await AsyncStorage.setItem('theme', isDark ? 'dark' : 'light');
    dispatch(setTheme(isDark));
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};

export default themeSlice.reducer;
