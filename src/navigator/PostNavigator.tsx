import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Post from '../pages/Post';
import PostLoad from '../pages/PostLoad';
import PostTruck from '../pages/PostTruck';
import PostDriver from '../pages/PostDriver';

export type PostStackParamList = {
  PostMain: undefined;
  PostLoad: undefined;
  PostTruck: undefined;
  PostDriver: undefined;
};

const Stack = createNativeStackNavigator<PostStackParamList>();

export default function PostNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="PostMain" component={Post} />
      <Stack.Screen name="PostLoad" component={PostLoad} />
      <Stack.Screen name="PostTruck" component={PostTruck} />
      <Stack.Screen name="PostDriver" component={PostDriver} />
    </Stack.Navigator>
  );
}
