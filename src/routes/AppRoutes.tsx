import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { paths } from "./paths";
import { ProtectedRoute } from "./ProtectedRoutes";
import { LoginScreen } from "../pages/LoginScreen";
import { RegisterScreen } from "../pages/RegisterScreen";
import { MenuScreen } from "../pages/MenuScreen";
import { AudioRecordingScreen } from "../pages/AudioRecordingScreen";
import { SubjectAudioScreen } from "../pages/SubjectAudioScreen";
import { QuestionsScreen } from "../pages/QuestionsScreen";
import { QuestionsHomeScreen } from "../pages/QuestionsHomeScreen";

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
        <Stack.Screen
          name={paths.audioRecording}
          component={() => (
            <ProtectedRoute>
              <AudioRecordingScreen />
            </ProtectedRoute>
          )}
        />
        <Stack.Screen
          name="subject-audio"
          component={({ route }: any) => (
            <ProtectedRoute>
              <SubjectAudioScreen subject={route.params?.subject || ""} />
            </ProtectedRoute>
          )}
        />
        <Stack.Screen
          name={paths.questionsHome}
          component={() => (
            <ProtectedRoute>
              <QuestionsHomeScreen />
            </ProtectedRoute>
          )}
        />
        <Stack.Screen
          name={paths.questionsBySubject}
          component={({ route }: any) => (
            <ProtectedRoute>
              <QuestionsScreen />
            </ProtectedRoute>
          )}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
