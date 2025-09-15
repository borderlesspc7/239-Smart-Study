import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { paths } from "./paths";
import { ProtectedRoute } from "./ProtectedRoutes";
import { LoginScreen } from "../pages/LoginScreen";
import { RegisterScreen } from "../pages/RegisterScreen";
import { MenuScreen } from "../pages/MenuScreen";

const Stack = createNativeStackNavigator();

export const AppRoutes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={paths.login}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name={paths.login} component={LoginScreen} />
        <Stack.Screen name={paths.register} component={RegisterScreen} />
        <Stack.Screen
          name={paths.dashboard}
          component={() => (
            <ProtectedRoute>
              <MenuScreen />
            </ProtectedRoute>
          )}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
