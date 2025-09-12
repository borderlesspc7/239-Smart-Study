import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { CustomButton } from "../components/button/customButton";
import { useAuth } from "../hooks/useAuth";
import { paths } from "../routes/paths";

export function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, clearError } = useAuth();
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    try {
      await login({ email, password });
      navigation.navigate(paths.menu as never);
    } catch (err) {
      // O erro já é tratado no AuthContext
    }
  };

  React.useEffect(() => {
    if (error) {
      Alert.alert("Erro de Login", error);
      clearError();
    }
  }, [error, clearError]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>Smart Student</Text>
          <Text style={styles.subtitle}>
            Otimize seu aprendizado e retenção de conhecimentos
          </Text>
        </View>

        {/* Login Form Card */}
        <View style={styles.formCard}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.bookIcon}>
              <Ionicons name="book-outline" size={32} color="#E53E3E" />
            </View>
          </View>

          {/* Form Title */}
          <Text style={styles.formTitle}>Entrar</Text>
          <Text style={styles.formSubtitle}>
            Entre na sua conta para continuar estudando
          </Text>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={16}
                color="#6B7280"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Senha</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={16}
                color="#6B7280"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Sua senha"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={16}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <CustomButton
            type="primary"
            onPress={handleLogin}
            text={loading ? "Entrando..." : "Entrar"}
            isDisabled={loading}
          />

          {/* Forgot Password Link */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          {/* Register Link */}
          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate(paths.register as never)}
          >
            <Text style={styles.registerLinkText}>
              Não tem uma conta?{" "}
              <Text style={styles.registerLinkTextBold}>Criar conta</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  bookIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E53E3E",
  },
  bookIconText: {
    fontSize: 28,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#374151",
    textAlign: "center",
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#374151",
  },
  eyeIcon: {
    padding: 4,
  },
  eyeIconText: {
    fontSize: 16,
  },
  forgotPassword: {
    alignItems: "center",
    marginTop: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  registerLink: {
    alignItems: "center",
    marginTop: 24,
  },
  registerLinkText: {
    fontSize: 14,
    color: "#6B7280",
  },
  registerLinkTextBold: {
    color: "#E53E3E",
    fontWeight: "600",
  },
});
