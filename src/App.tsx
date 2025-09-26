import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { useAppDispatch } from './store/hooks';
import { store, persistor } from './store/store';
import { loadThemeFromStorage } from './store/slice/themeSlice';
import AppNavigator from './navigator/AppNavigator';

// Theme initialization component
function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadThemeFromStorage());
  }, [dispatch]);

  return <>{children}</>;
}

// Wrapper component that can use the useSafeAreaInsets hook
function AppContent() {
  const isDarkMode = useColorScheme() === 'light';
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent"
        translucent={true}
      />
      <View style={[styles.container, { paddingTop: 0 }]}>
        <AppNavigator />
      </View>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeInitializer>
          <SafeAreaProvider>
            <AppContent />
          </SafeAreaProvider>
        </ThemeInitializer>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
  },
});

export default App;
