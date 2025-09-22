import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MarketPlace from '../pages/MarketPlace';
import AddPost from '../pages/AddPost';
import PostLoad from '../pages/PostLoad';
import PostTruck from '../pages/PostTruck';
import PostDriver from '../pages/PostDriver';
import PostNavigator from './PostNavigator';
import PostRequirementScreen from '../pages/Post';

const MarketPlaceNavigator = () => {
  type MarketPlaceStackParamList = {
    MarketPlace: undefined;
    AddPost: undefined;
    PostLoad: undefined;
    PostTruck: undefined;
    PostDriver: undefined;
    Post: undefined;
  };
  const Stack = createNativeStackNavigator<MarketPlaceStackParamList>();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MarketPlace" component={MarketPlace} options={{headerShown: false}} />
      <Stack.Screen name="AddPost" component={AddPost} />
      <Stack.Screen name="Post" component={PostRequirementScreen} />
      <Stack.Screen name="PostLoad" component={PostLoad} />
      <Stack.Screen name="PostTruck" component={PostTruck} />
      <Stack.Screen name="PostDriver" component={PostDriver} />
    </Stack.Navigator>
  );
};

export default MarketPlaceNavigator;

const styles = StyleSheet.create({});
