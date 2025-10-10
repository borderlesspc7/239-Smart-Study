import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AudioRecordingScreen } from "../pages/AudioRecordingScreen";
import { ExamSelectionScreen } from "../pages/ExamSelectionScreen";
import { LoginScreen } from "../pages/LoginScreen";
import { MenuScreen } from "../pages/MenuScreen";
import { QuestionDetailScreen } from "../pages/QuestionDetailScreen";
import { QuestionsHomeScreen } from "../pages/QuestionsHomeScreen";
import { QuestionsScreen } from "../pages/QuestionsScreen";
import { RegisterScreen } from "../pages/RegisterScreen";
import { SettingsScreen } from "../pages/SettingsScreen";
import { SimulatorScreen } from "../pages/SimulatorScreen";
import { SubjectAudioScreen } from "../pages/SubjectAudioScreen";
import { paths } from "./paths";
import { ProtectedRoute } from "./ProtectedRoutes";

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
          name={paths.examSelection}
          component={ExamSelectionScreen}
        />
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
          name={paths.simulator}
          component={() => (
            <ProtectedRoute>
              <SimulatorScreen />
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
        <Stack.Screen
          name={paths.questionDetail}
          component={({ route }: any) => (
            <ProtectedRoute>
              <QuestionDetailScreen />
            </ProtectedRoute>
          )}
        />
        <Stack.Screen
          name={paths.settings}
          component={() => (
            <ProtectedRoute>
              <SettingsScreen />
            </ProtectedRoute>
          )}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
