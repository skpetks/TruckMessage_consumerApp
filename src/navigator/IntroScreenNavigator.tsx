import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FastagRecharge from '../pages/introScreens/FastagRecharge';
import RenewInsurence from '../pages/introScreens/RenewInsurence';
import FindOnMarketplace from '../pages/introScreens/FindOnMarketplace';
import Utilities from '../pages/introScreens/Utilities';

export type PostStackParamList = {
    FastagRecharge: undefined;
    RenewInsurence: undefined;
    FindOnMarketplace: undefined;
    Utilities: undefined;
};

const Stack = createNativeStackNavigator<PostStackParamList>();

export default function IntroScreenNavigator() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="FastagRecharge" component={FastagRecharge} />
      <Stack.Screen name="RenewInsurence" component={RenewInsurence} />
      <Stack.Screen name="FindOnMarketplace" component={FindOnMarketplace} />
      <Stack.Screen name="Utilities" component={Utilities} />
    </Stack.Navigator>
  );
}