import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import Home from '../pages/Home';
// import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import Register from '../pages/Register';
import Login from '../pages/Login';
import BottomTabNavigation from './BottomTabNavigation';

const Stack = createStackNavigator();

function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="BottomTabNavigation" component={BottomTabNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
