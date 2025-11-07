"use client";

import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomButton } from "../components/button/customButton";
import { useAuth } from "../hooks/useAuth";
import { categories } from "../models/question";
import { paths } from "../routes/paths";
import { userService } from "../services/userService";

interface SubjectSelectionScreenProps {
  isOnboarding?: boolean;
}

export function SubjectSelectionScreen({
  isOnboarding = true,
}: SubjectSelectionScreenProps) {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const navigation = useNavigation();
  const { user } = useAuth();

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects((prev) => {
      if (prev.includes(subjectId)) {
        return prev.filter((id) => id !== subjectId);
      }
      return [...prev, subjectId];
    });
  };

  const handleSelectAll = () => {
    if (selectedSubjects.length === categories.length) {
      setSelectedSubjects([]);
    } else {
      setSelectedSubjects(categories.map((cat) => cat.id));
    }
  };

  const handleContinue = async () => {
    if (selectedSubjects.length === 0) {
      Alert.alert(
        "Atenção",
        "Por favor, selecione pelo menos uma matéria para estudar"
      );
      return;
    }

    if (user?.uid) {
      try {
        setIsSaving(true);
        await userService.savePreferredSubjects(user.uid, selectedSubjects);
        console.log(
          "[v0] Preferred subjects saved successfully:",
          selectedSubjects
        );

        if (isOnboarding) {
          navigation.navigate(paths.contentTopicsSelection as never);
        } else {
          navigation.goBack();
        }
      } catch (error) {
        console.error("[v0] Error saving preferred subjects:", error);
        Alert.alert(
          "Erro",
          "Não foi possível salvar suas preferências. Tente novamente."
        );
      } finally {
        setIsSaving(false);
      }
    } else {
      Alert.alert("Erro", "Usuário não autenticado");
    }
  };

  const getSubjectIcon = (
    name: string
  ): keyof typeof MaterialIcons.glyphMap => {
    const iconMap: Record<string, keyof typeof MaterialIcons.glyphMap> = {
      Matemática: "calculate",
      Física: "science",
      Química: "biotech",
      Biologia: "eco",
      História: "history-edu",
      Geografia: "public",
      Português: "menu-book",
      Literatura: "auto-stories",
      Filosofia: "psychology",
      Sociologia: "groups",
      Inglês: "language",
    };
    return iconMap[name] || "school";
  };

  const getSubjectColor = (name: string): string => {
    const colorMap: Record<string, string> = {
      Matemática: "#3B82F6",
      Física: "#8B5CF6",
      Química: "#10B981",
      Biologia: "#059669",
      História: "#F59E0B",
      Geografia: "#06B6D4",
      Português: "#EF4444",
      Literatura: "#EC4899",
      Filosofia: "#6366F1",
      Sociologia: "#14B8A6",
      Inglês: "#F97316",
    };
    return colorMap[name] || "#6B7280";
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
                ? "Quais matérias você quer estudar?"
                : "Alterar matérias de estudo"}
            </Text>
            <Text style={styles.subtitle}>
              Selecione as matérias que deseja focar nos seus estudos. Você pode
              escolher quantas quiser.
            </Text>
          </View>
        </View>

        <View style={styles.selectAllContainer}>
          <TouchableOpacity
            style={styles.selectAllButton}
            onPress={handleSelectAll}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={
                selectedSubjects.length === categories.length
                  ? "check-box"
                  : "check-box-outline-blank"
              }
              size={24}
              color="#4F46E5"
            />
            <Text style={styles.selectAllText}>
              {selectedSubjects.length === categories.length
                ? "Desmarcar todas"
                : "Selecionar todas"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.selectedCount}>
            {selectedSubjects.length} de {categories.length} selecionadas
          </Text>
        </View>

        <View style={styles.subjectsContainer}>
          {categories.map((category) => {
            const isSelected = selectedSubjects.includes(category.id);
            const color = getSubjectColor(category.name);

            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.subjectCard,
                  isSelected && styles.subjectCardSelected,
                  isSelected && { borderColor: color },
                ]}
                onPress={() => handleSubjectToggle(category.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${color}20` },
                  ]}
                >
                  <MaterialIcons
                    name={getSubjectIcon(category.name)}
                    size={28}
                    color={color}
                  />
                </View>
                <View style={styles.subjectInfo}>
                  <Text style={styles.subjectName}>{category.name}</Text>
                </View>
                <View style={styles.checkContainer}>
                  {isSelected ? (
                    <MaterialIcons
                      name="check-circle"
                      size={28}
                      color={color}
                    />
                  ) : (
                    <View style={styles.uncheckedCircle} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.infoBox}>
          <MaterialIcons name="info-outline" size={20} color="#3B82F6" />
          <Text style={styles.infoText}>
            Você poderá alterar suas matérias a qualquer momento nas
            configurações do app
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <CustomButton
          type="primary"
          onPress={handleContinue}
          isDisabled={selectedSubjects.length === 0 || isSaving}
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
    paddingBottom: 100,
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
  selectAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  selectAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  selectAllText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4F46E5",
  },
  selectedCount: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  subjectsContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  subjectCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  subjectCardSelected: {
    backgroundColor: "#F5F3FF",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  checkContainer: {
    marginLeft: 12,
  },
  uncheckedCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#D1D5DB",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginTop: 24,
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
  },
});
