import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../pages/Home';
import CustomBottomTab from '../components/CustomBottomTab';
import Browse from '../pages/Browse';
import PostNavigator from './PostNavigator';
import Profile from '../pages/Profile';
import MarketPlaceNavigator from './MarketPlaceNavigator';
import Message from '../pages/Message';

export type TabParamList = {
  Home: undefined;
  MarketPlace: undefined;
  Message: undefined;
  Profile: undefined;
  More: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function BottomTabNavigation() {
  return (
    <Tab.Navigator
    screenOptions={{ headerShown: false }}
    tabBar={(props) => <CustomBottomTab {...props} />}
  >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="MarketPlace" component={MarketPlaceNavigator} options={{headerShown: false}} />
      <Tab.Screen name="Message" component={Message} />
      <Tab.Screen name="Profile" component={Profile} />
      {/* <Tab.Screen name="More" component={Browse} /> */}
    </Tab.Navigator>
  );
}