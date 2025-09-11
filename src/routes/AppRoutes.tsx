import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/native-stack";
import { paths } from "./paths";
import { ProtectedRoute } from "./ProtectedRoutes";
import { LoginScreen } from "../pages/LoginScreen";
import { RegisterScreen } from "../pages/RegisterScreen";
import { MenuScreen } from "../pages/MenuScreen";

const Stack = createStackNavigator();

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
          name={paths.menu}
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
