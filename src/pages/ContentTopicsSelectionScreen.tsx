"use client";

import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomButton } from "../components/button/customButton";
import { useAuth } from "../hooks/useAuth";
import { paths } from "../routes/paths";
import { userService } from "../services/userService";

interface ContentTopicsSelectionScreenProps {
  isOnboarding?: boolean;
}

export function ContentTopicsSelectionScreen({
  isOnboarding = true,
}: ContentTopicsSelectionScreenProps) {
  const [topics, setTopics] = useState<string[]>([]);
  const [currentTopic, setCurrentTopic] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const navigation = useNavigation();
  const { user } = useAuth();

  const handleAddTopic = () => {
    const trimmedTopic = currentTopic.trim();

    if (!trimmedTopic) {
      return;
    }

    if (topics.includes(trimmedTopic)) {
      Alert.alert("Atenção", "Este conteúdo já foi adicionado");
      return;
    }

    if (topics.length >= 20) {
      Alert.alert(
        "Limite atingido",
        "Você pode adicionar no máximo 20 conteúdos específicos"
      );
      return;
    }

    setTopics((prev) => [...prev, trimmedTopic]);
    setCurrentTopic("");
  };

  const handleRemoveTopic = (topicToRemove: string) => {
    setTopics((prev) => prev.filter((topic) => topic !== topicToRemove));
  };

  const handleContinue = async () => {
    if (user?.uid) {
      try {
        setIsSaving(true);

        if (topics.length > 0) {
          await userService.saveContentTopics(user.uid, topics);
          console.log("[v0] Content topics saved successfully:", topics);
        }

        navigation.navigate(paths.dashboard as never);
      } catch (error) {
        console.error("[v0] Error saving content topics:", error);
        Alert.alert(
          "Erro",
          "Não foi possível salvar seus conteúdos. Tente novamente."
        );
      } finally {
        setIsSaving(false);
      }
    } else {
      Alert.alert("Erro", "Usuário não autenticado");
    }
  };

  const handleSkip = () => {
    if (isOnboarding) {
      Alert.alert(
        "Pular seleção",
        "Você poderá adicionar conteúdos específicos depois nas configurações. Deseja continuar?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Continuar",
            onPress: () => navigation.navigate(paths.dashboard as never),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          {!isOnboarding && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
          )}
          <View style={styles.headerContent}>
            <Text style={styles.title}>
              {isOnboarding
                ? "Conteúdos específicos"
                : "Alterar conteúdos específicos"}
            </Text>
            <Text style={styles.subtitle}>
              Adicione conteúdos específicos que você quer estudar. Isso é
              opcional e pode ser alterado depois.
            </Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="add-circle-outline"
              size={24}
              color="#6B7280"
            />
            <TextInput
              style={styles.input}
              placeholder="Ex: Trigonometria, Revolução Francesa..."
              placeholderTextColor="#9CA3AF"
              value={currentTopic}
              onChangeText={setCurrentTopic}
              onSubmitEditing={handleAddTopic}
              returnKeyType="done"
              maxLength={50}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.addButton,
              !currentTopic.trim() && styles.addButtonDisabled,
            ]}
            onPress={handleAddTopic}
            disabled={!currentTopic.trim()}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="add"
              size={24}
              color={currentTopic.trim() ? "#FFFFFF" : "#9CA3AF"}
            />
          </TouchableOpacity>
        </View>

        {topics.length > 0 && (
          <View style={styles.topicsSection}>
            <View style={styles.topicsSectionHeader}>
              <Text style={styles.topicsSectionTitle}>
                Conteúdos adicionados ({topics.length})
              </Text>
              {topics.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "Limpar todos",
                      "Deseja remover todos os conteúdos adicionados?",
                      [
                        { text: "Cancelar", style: "cancel" },
                        {
                          text: "Limpar",
                          style: "destructive",
                          onPress: () => setTopics([]),
                        },
                      ]
                    );
                  }}
                >
                  <Text style={styles.clearAllText}>Limpar todos</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.topicsContainer}>
              {topics.map((topic, index) => (
                <View key={index} style={styles.topicChip}>
                  <Text style={styles.topicText} numberOfLines={1}>
                    {topic}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveTopic(topic)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <MaterialIcons name="close" size={18} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {topics.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="lightbulb-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>
              Nenhum conteúdo adicionado
            </Text>
            <Text style={styles.emptyStateText}>
              Adicione conteúdos específicos que você quer focar nos seus
              estudos, como "Funções Quadráticas" ou "Segunda Guerra Mundial"
            </Text>
          </View>
        )}

        <View style={styles.infoBox}>
          <MaterialIcons name="info-outline" size={20} color="#3B82F6" />
          <Text style={styles.infoText}>
            Esta etapa é opcional. Você pode pular e adicionar conteúdos
            específicos depois nas configurações do app.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        {isOnboarding && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Pular por enquanto</Text>
          </TouchableOpacity>
        )}
        <CustomButton
          type="primary"
          onPress={handleContinue}
          isDisabled={isSaving}
          text={
            isSaving
              ? "Salvando..."
              : isOnboarding
              ? "Continuar"
              : "Salvar alterações"
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 140,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  backButton: {
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  headerContent: {
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    padding: 0,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  topicsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  topicsSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  topicsSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#EF4444",
  },
  topicsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  topicChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
    maxWidth: "100%",
  },
  topicText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    flexShrink: 1,
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
  },
  emptyStateText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#1E40AF",
    lineHeight: 20,
  },
  bottomActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 12,
  },
  skipButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
  },
});
