import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import counterReducer from './slice/counterSlice';
import userReducer from './slice/user';
import themeReducer from './slice/themeSlice';

const persistConfig = {
  key: 'root', 
  storage: AsyncStorage,
  whitelist: ['user', 'theme'], // Persist user and theme data
};

const rootReducer = combineReducers({
  counter: counterReducer,
  user: userReducer,
  theme: themeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;