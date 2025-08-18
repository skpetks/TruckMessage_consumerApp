import React from "react";
import { NavigationContainer } from "@react-navigation/native";
// @ts-ignore
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BottomTabNavigation from "./BottomTabNavigation";
import AuthNavigator from "./AuthNavigator";
import { selectIsAuthenticated } from "../store/slice/user";
import { useAppSelector } from "../store/hooks";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const  isLoggedIn  = useAppSelector(selectIsAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="BottomTabNavigation" component={BottomTabNavigation} />
        ) : (
          <Stack.Screen name="AuthStack" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}