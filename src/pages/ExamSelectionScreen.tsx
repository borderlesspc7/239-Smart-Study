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
import { paths } from "../routes/paths";
import { userService } from "../services/userService";

type ExamType = "ENEM" | "VESTIBULAR" | "CONCURSO" | "GENERAL";

interface ExamOption {
  type: ExamType;
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
}

const examOptions: ExamOption[] = [
  {
    type: "ENEM",
    title: "ENEM",
    description: "Exame Nacional do Ensino Médio",
    icon: "school",
    color: "#10B981",
  },
  {
    type: "VESTIBULAR",
    title: "Vestibular",
    description: "Vestibulares de universidades públicas e privadas",
    icon: "menu-book",
    color: "#3B82F6",
  },
  {
    type: "CONCURSO",
    title: "Concurso Público",
    description: "Concursos públicos federais, estaduais e municipais",
    icon: "work",
    color: "#8B5CF6",
  },
  {
    type: "GENERAL",
    title: "Estudos Gerais",
    description: "Estudo geral sem foco em prova específica",
    icon: "auto-stories",
    color: "#F59E0B",
  },
];

interface ExamSelectionScreenProps {
  isOnboarding?: boolean;
}

export function ExamSelectionScreen({
  isOnboarding = true,
}: ExamSelectionScreenProps) {
  const [selectedExam, setSelectedExam] = useState<ExamType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigation = useNavigation();
  const { user } = useAuth();

  const handleExamSelect = (examType: ExamType) => {
    setSelectedExam(examType);
  };

  const handleContinue = async () => {
    if (!selectedExam) {
      Alert.alert(
        "Atenção",
        "Por favor, selecione o tipo de prova que você vai fazer"
      );
      return;
    }

    if (user?.uid) {
      try {
        setIsSaving(true);
        await userService.saveExamType(user.uid, selectedExam);
        console.log("[v0] Exam type saved successfully:", selectedExam);

        navigation.navigate(paths.dashboard as never);
      } catch (error) {
        console.error("[v0] Error saving exam type:", error);
        Alert.alert(
          "Erro",
          "Não foi possível salvar sua preferência. Tente novamente."
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
        "Você poderá escolher o tipo de prova depois nas configurações. Deseja continuar?",
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
                ? "Qual prova você vai fazer?"
                : "Alterar tipo de prova"}
            </Text>
            <Text style={styles.subtitle}>
              Selecione o tipo de prova para receber questões personalizadas
            </Text>
          </View>
        </View>

        <View style={styles.optionsContainer}>
          {examOptions.map((option) => (
            <TouchableOpacity
              key={option.type}
              style={[
                styles.examCard,
                selectedExam === option.type && styles.examCardSelected,
              ]}
              onPress={() => handleExamSelect(option.type)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${option.color}20` },
                ]}
              >
                <MaterialIcons
                  name={option.icon}
                  size={32}
                  color={option.color}
                />
              </View>
              <View style={styles.examInfo}>
                <Text style={styles.examTitle}>{option.title}</Text>
                <Text style={styles.examDescription}>{option.description}</Text>
              </View>
              <View style={styles.checkContainer}>
                {selectedExam === option.type ? (
                  <MaterialIcons
                    name="check-circle"
                    size={28}
                    color={option.color}
                  />
                ) : (
                  <View style={styles.uncheckedCircle} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <MaterialIcons name="info-outline" size={20} color="#3B82F6" />
          <Text style={styles.infoText}>
            Você poderá alterar essa configuração a qualquer momento nas
            configurações do app
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
          isDisabled={!selectedExam || isSaving}
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
    paddingBottom: 120,
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
  optionsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  examCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  examCardSelected: {
    borderColor: "#4F46E5",
    backgroundColor: "#F5F3FF",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  examInfo: {
    flex: 1,
    gap: 4,
  },
  examTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  examDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
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
