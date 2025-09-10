import { StatusBar } from "expo-status-bar";
import {
  Button,
  KeyboardAvoidingView,
  KeyboardAvoidingViewComponent,
  StyleSheet,
  Text,
  TouchableNativeFeedbackBase,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomButton } from "./src/components/button/customButton";
import React from "react";

export default function App() {
  return (
    <View style={styles.container}>
      <CustomButton type="primary" onPress={() => {}} text="Clique aqui" />
      <CustomButton
        type="secondary"
        onPress={() => {}}
        text="Clique aqui"
        isDisabled
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
