import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { CustomButton } from "../components/button/customButton";
import { useAuth } from "../hooks/useAuth";

export function MenuScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            Alert.alert("Erro", "Não foi possível sair da conta");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bem-vindo!</Text>
        <Text style={styles.subtitle}>Olá, {user?.name || "Usuário"}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.buttonContainer}>
          <CustomButton type="secondary" onPress={handleLogout} text="Sair" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 5,
    textAlign: "center",
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 200,
  },
});
