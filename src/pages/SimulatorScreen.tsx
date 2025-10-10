"use client";

import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomButton } from "../components/button/customButton";
import { Layout } from "../components/layout";
import { useAuth } from "../hooks/useAuth";
import type { Question } from "../models/question";
import { categories } from "../models/question/categories";
import { questionService } from "../services/questionService";
import { userService } from "../services/userService";

type ExamType = "ENEM" | "VESTIBULAR" | "CONCURSO" | "GENERAL";

export const SimulatorScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [examType, setExamType] = useState<ExamType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<
    { questionId: string; answer: string; isCorrect: boolean }[]
  >([]);
  const [showResults, setShowResults] = useState(false);
  const [simulatorStarted, setSimulatorStarted] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const loadUserExamType = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      const userExamType = await userService.getExamType(user.uid);
      setExamType(userExamType);
    } catch (error) {
      console.error("[v0] Error loading exam type:", error);
      Alert.alert("Erro", "Não foi possível carregar suas preferências");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserExamType();
  }, [user?.uid]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserExamType();
    setRefreshing(false);
  };

  const handleStartSimulator = () => {
    if (!examType) {
      Alert.alert(
        "Atenção",
        "Você precisa selecionar um tipo de prova nas configurações primeiro"
      );
      return;
    }
    setShowCategoryModal(true);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowCategoryModal(false);

    // Get questions filtered by exam type and category
    const filteredQuestions = questionService.getRandomQuestions(
      {
        examType: examType!,
        categoryId: categoryId,
      },
      10 // Get 10 random questions
    );

    if (filteredQuestions.length === 0) {
      Alert.alert(
        "Atenção",
        "Não há questões disponíveis para esta combinação de prova e matéria"
      );
      return;
    }

    setQuestions(filteredQuestions);
    setSimulatorStarted(true);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setShowResults(false);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (!selectedAnswer) {
      Alert.alert("Atenção", "Por favor, selecione uma resposta");
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.answer;

    // Save user answer
    setUserAnswers([
      ...userAnswers,
      {
        questionId: currentQuestion.id,
        answer: selectedAnswer,
        isCorrect,
      },
    ]);

    // Move to next question or show results
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      // Show results
      setShowResults(true);
    }
  };

  const handleRestartSimulator = () => {
    setSimulatorStarted(false);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setShowResults(false);
    setQuestions([]);
    setSelectedCategory(null);
  };

  const calculateScore = () => {
    const correctAnswers = userAnswers.filter((a) => a.isCorrect).length;
    return {
      correct: correctAnswers,
      total: questions.length,
      percentage: Math.round((correctAnswers / questions.length) * 100),
    };
  };

  if (loading) {
    return (
      <Layout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </Layout>
    );
  }

  if (!simulatorStarted) {
    return (
      <Layout>
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.welcomeContainer}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="quiz" size={48} color="#4F46E5" />
            </View>
            <Text style={styles.welcomeTitle}>Simulador de Provas</Text>
            <Text style={styles.welcomeSubtitle}>
              Pratique com questões personalizadas para o seu tipo de prova
            </Text>

            {examType && (
              <View style={styles.examTypeCard}>
                <MaterialIcons name="school" size={24} color="#4F46E5" />
                <View style={styles.examTypeInfo}>
                  <Text style={styles.examTypeLabel}>Tipo de prova:</Text>
                  <Text style={styles.examTypeValue}>{examType}</Text>
                </View>
              </View>
            )}

            <CustomButton
              type="primary"
              onPress={handleStartSimulator}
              text="Iniciar Simulado"
            />

            <View style={styles.infoBox}>
              <MaterialIcons name="info-outline" size={20} color="#3B82F6" />
              <Text style={styles.infoText}>
                O simulado contém 10 questões selecionadas de acordo com o tipo
                de prova e matéria escolhida
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Category Selection Modal */}
        <Modal
          visible={showCategoryModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Selecione a Matéria</Text>
                <TouchableOpacity
                  onPress={() => setShowCategoryModal(false)}
                  style={styles.closeButton}
                >
                  <MaterialIcons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.categoryList}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.categoryItem}
                    onPress={() => handleCategorySelect(category.id)}
                  >
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <MaterialIcons
                      name="chevron-right"
                      size={24}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </Layout>
    );
  }

  if (showResults) {
    const score = calculateScore();
    return (
      <Layout>
        <ScrollView style={styles.container}>
          <View style={styles.resultsContainer}>
            <View
              style={[
                styles.scoreCircle,
                score.percentage >= 70
                  ? styles.scoreCircleGood
                  : styles.scoreCircleBad,
              ]}
            >
              <Text style={styles.scorePercentage}>{score.percentage}%</Text>
              <Text style={styles.scoreLabel}>Acertos</Text>
            </View>

            <Text style={styles.resultsTitle}>Simulado Concluído!</Text>
            <Text style={styles.resultsSubtitle}>
              Você acertou {score.correct} de {score.total} questões
            </Text>

            <View style={styles.resultsStats}>
              <View style={styles.statItem}>
                <MaterialIcons name="check-circle" size={32} color="#10B981" />
                <Text style={styles.statValue}>{score.correct}</Text>
                <Text style={styles.statLabel}>Corretas</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialIcons name="cancel" size={32} color="#EF4444" />
                <Text style={styles.statValue}>
                  {score.total - score.correct}
                </Text>
                <Text style={styles.statLabel}>Erradas</Text>
              </View>
            </View>

            <View style={styles.resultsActions}>
              <CustomButton
                type="primary"
                onPress={handleRestartSimulator}
                text="Novo Simulado"
              />
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.secondaryButtonText}>Voltar ao Menu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Layout>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Layout>
      <View style={styles.container}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            Questão {currentQuestionIndex + 1} de {questions.length}
          </Text>
        </View>

        <ScrollView style={styles.questionContainer}>
          {/* Question Header */}
          <View style={styles.questionHeader}>
            <View style={styles.questionBadge}>
              <Text style={styles.questionBadgeText}>
                {currentQuestion.category}
              </Text>
            </View>
            <View
              style={[
                styles.difficultyBadge,
                currentQuestion.difficulty === "Fácil" && styles.difficultyEasy,
                currentQuestion.difficulty === "Médio" &&
                  styles.difficultyMedium,
                currentQuestion.difficulty === "Difícil" &&
                  styles.difficultyHard,
              ]}
            >
              <Text style={styles.difficultyText}>
                {currentQuestion.difficulty}
              </Text>
            </View>
          </View>

          {/* Question Text */}
          <Text style={styles.questionText}>{currentQuestion.question}</Text>

          {/* Answer Options */}
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionCard,
                  selectedAnswer === option && styles.optionCardSelected,
                ]}
                onPress={() => handleAnswerSelect(option)}
              >
                <View
                  style={[
                    styles.optionRadio,
                    selectedAnswer === option && styles.optionRadioSelected,
                  ]}
                >
                  {selectedAnswer === option && (
                    <View style={styles.optionRadioInner} />
                  )}
                </View>
                <Text
                  style={[
                    styles.optionText,
                    selectedAnswer === option && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Action */}
        <View style={styles.bottomAction}>
          <CustomButton
            type="primary"
            onPress={handleNextQuestion}
            text={
              currentQuestionIndex < questions.length - 1
                ? "Próxima Questão"
                : "Ver Resultado"
            }
            isDisabled={!selectedAnswer}
          />
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  welcomeContainer: {
    padding: 24,
    alignItems: "center",
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  examTypeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  examTypeInfo: {
    marginLeft: 12,
    flex: 1,
  },
  examTypeLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  examTypeValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#1E40AF",
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  categoryList: {
    padding: 16,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  progressContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4F46E5",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  questionContainer: {
    flex: 1,
    padding: 24,
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  questionBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  questionBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4F46E5",
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  difficultyEasy: {
    backgroundColor: "#D1FAE5",
  },
  difficultyMedium: {
    backgroundColor: "#FEF3C7",
  },
  difficultyHard: {
    backgroundColor: "#FEE2E2",
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "600",
  },
  questionText: {
    fontSize: 18,
    color: "#111827",
    lineHeight: 28,
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  optionCardSelected: {
    borderColor: "#4F46E5",
    backgroundColor: "#F5F3FF",
  },
  optionRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  optionRadioSelected: {
    borderColor: "#4F46E5",
  },
  optionRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4F46E5",
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
  },
  optionTextSelected: {
    color: "#111827",
    fontWeight: "500",
  },
  bottomAction: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  resultsContainer: {
    padding: 24,
    alignItems: "center",
  },
  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 8,
  },
  scoreCircleGood: {
    backgroundColor: "#D1FAE5",
    borderColor: "#10B981",
  },
  scoreCircleBad: {
    backgroundColor: "#FEE2E2",
    borderColor: "#EF4444",
  },
  scorePercentage: {
    fontSize: 48,
    fontWeight: "700",
    color: "#111827",
  },
  scoreLabel: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  resultsSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
  },
  resultsStats: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 32,
  },
  statItem: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    minWidth: 120,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  resultsActions: {
    width: "100%",
    gap: 12,
  },
  secondaryButton: {
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
});
