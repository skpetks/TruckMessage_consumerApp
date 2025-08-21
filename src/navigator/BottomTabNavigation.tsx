import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../pages/Home';
import CustomBottomTab from '../components/CustomBottomTab';
import Browse from '../pages/Browse';
import PostNavigator from './PostNavigator';
import Profile from '../pages/Profile';

export type TabParamList = {
  Home: undefined;
  Browse: undefined;
  Post: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function BottomTabNavigation() {
  return (
    <Tab.Navigator
    screenOptions={{ headerShown: false }}
    tabBar={(props) => <CustomBottomTab {...props} />}
  >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Browse" component={Browse} />
      <Tab.Screen name="Post" component={PostNavigator} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}