import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../pages/Profile';
import Appearance from '../pages/Appearance';

export type PostStackParamList = {
  Profile: undefined;
  Appearance: undefined;
};

const Stack = createNativeStackNavigator<PostStackParamList>();

export default function ProfileNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Appearance" component={Appearance} />
    </Stack.Navigator>
  );
}
