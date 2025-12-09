import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AboutScreen } from "../pages/AboutScreen";
import { AudioRecordingScreen } from "../pages/AudioRecordingScreen";
import { ContentLibraryScreen } from "../pages/ContentLibraryScreen";
import { ContentsScreen } from "../pages/ContentScreen";
import { ContentTopicsSelectionScreen } from "../pages/ContentTopicsSelectionScreen";
import { ExamSelectionScreen } from "../pages/ExamSelectionScreen";
import { LoginScreen } from "../pages/LoginScreen";
import { MenuScreen } from "../pages/MenuScreen";
import { ProfileScreen } from "../pages/ProfileScreen";
import { QuestionDetailScreen } from "../pages/QuestionDetailScreen";
import { QuestionsHomeScreen } from "../pages/QuestionsHomeScreen";
import { QuestionsScreen } from "../pages/QuestionsScreen";
import { RegisterScreen } from "../pages/RegisterScreen";
import { ReportsScreen } from "../pages/ReportsScreen";
import { SettingsScreen } from "../pages/SettingsScreen";
import { SimulatorScreen } from "../pages/SimulatorScreen";
import { StatisticsScreen } from "../pages/StatisticsScreen";
import { SubjectAudioScreen } from "../pages/SubjectAudioScreen";
import { SubjectSelectionScreen } from "../pages/SubjectSelectionScreen";
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
          name={paths.subjectSelection}
          component={SubjectSelectionScreen}
        />
        <Stack.Screen
          name={paths.contentTopicsSelection}
          component={ContentTopicsSelectionScreen}
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
        <Stack.Screen
          name={paths.reports}
          component={() => (
            <ProtectedRoute>
              <ReportsScreen />
            </ProtectedRoute>
          )}
        />
        <Stack.Screen
          name={paths.statistics}
          component={() => (
            <ProtectedRoute>
              <StatisticsScreen />
            </ProtectedRoute>
          )}
        />
        <Stack.Screen
          name={paths.profile}
          component={() => (
            <ProtectedRoute>
              <ProfileScreen />
            </ProtectedRoute>
          )}
        />
        <Stack.Screen
          name={paths.content}
          component={() => (
            <ProtectedRoute>
              <ContentsScreen />
            </ProtectedRoute>
          )}
        />
        <Stack.Screen
          name={paths.contentLibrary}
          component={() => (
            <ProtectedRoute>
              <ContentLibraryScreen />
            </ProtectedRoute>
          )}
        />
        <Stack.Screen
          name={paths.about}
          component={() => (
            <ProtectedRoute>
              <AboutScreen />
            </ProtectedRoute>
          )}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
