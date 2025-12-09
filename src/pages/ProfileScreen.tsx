"use client";

import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Layout } from "../components/layout";
import { useAuth } from "../hooks/useAuth";

export function ProfileScreen() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [preferredExamType, setPreferredExamType] = useState(
    user?.preferredExamType || ""
  );
  const [preferredSubjects, setPreferredSubjects] = useState(
    user?.preferredSubjects?.join(", ") || ""
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      //   await updateUserData({
      //     name,
      //     preferredExamType,
      //     preferredSubjects: preferredSubjects.split(",").map((s) => s.trim()),
      //   });
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    if (!currentPassword || !newPassword) {
      Alert.alert("Erro", "Preencha todos os campos de senha.");
      return;
    }

    setLoading(true);
    try {
      //await updateUserPassword(currentPassword, newPassword);
      Alert.alert("Sucesso", "Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível alterar a senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <Text style={styles.header}>Meu Perfil</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Tipo de Prova Preferida"
              value={preferredExamType}
              onChangeText={setPreferredExamType}
            />
            <TextInput
              style={styles.input}
              placeholder="Matérias Preferidas (separadas por vírgula)"
              value={preferredSubjects}
              onChangeText={setPreferredSubjects}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleUpdateProfile}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Salvando..." : "Salvar Perfil"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alterar Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Senha Atual"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Nova Senha"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmar Nova Senha"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#DC2626" }]}
              onPress={handleChangePassword}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Alterando..." : "Alterar Senha"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#F9FAFB",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginVertical: 20,
  },
  section: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
    color: "#111827",
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
