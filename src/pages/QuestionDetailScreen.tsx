"use client";

import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Layout } from "../components/layout";
import type { Question } from "../models/question";

interface RouteParams {
  question: Question;
}

export function QuestionDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { question } = route.params as RouteParams;

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return "#10B981";
      case "Médio":
        return "#F59E0B";
      case "Difícil":
        return "#DC2626";
      default:
        return "#6B7280";
    }
  };

  const handleSubmit = () => {
    if (!selectedOption) {
      Alert.alert("Atenção", "Por favor, selecione uma opção antes de enviar.");
      return;
    }

    setShowAnswer(true);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setShowAnswer(false);
  };

  const isCorrect = selectedOption === question.answer;

  return (
    <Layout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#4F46E5" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Questão</Text>
            <Text style={styles.headerSubtitle}>{question.category}</Text>
          </View>
        </View>

        {/* Question Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MaterialIcons name="category" size={20} color="#6B7280" />
              <Text style={styles.infoText}>{question.type}</Text>
            </View>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(question.difficulty) },
              ]}
            >
              <Text style={styles.difficultyText}>{question.difficulty}</Text>
            </View>
          </View>
          {question.examType && (
            <View style={styles.examTypeBadge}>
              <MaterialIcons name="school" size={16} color="#4F46E5" />
              <Text style={styles.examTypeText}>{question.examType}</Text>
            </View>
          )}
        </View>

        {/* Question Text */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionLabel}>Questão:</Text>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          <Text style={styles.optionsLabel}>Opções:</Text>
          {question.options.map((option, index) => {
            const optionLetter = String.fromCharCode(65 + index); // A, B, C, D...
            const isSelected = selectedOption === optionLetter;
            const isCorrectOption = optionLetter === question.answer;
            const showCorrectIndicator = showAnswer && isCorrectOption;
            const showWrongIndicator =
              showAnswer && isSelected && !isCorrectOption;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                  showCorrectIndicator && styles.optionCardCorrect,
                  showWrongIndicator && styles.optionCardWrong,
                ]}
                onPress={() => !showAnswer && setSelectedOption(optionLetter)}
                disabled={showAnswer}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <View
                    style={[
                      styles.optionCircle,
                      isSelected && styles.optionCircleSelected,
                      showCorrectIndicator && styles.optionCircleCorrect,
                      showWrongIndicator && styles.optionCircleWrong,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionLetter,
                        (isSelected ||
                          showCorrectIndicator ||
                          showWrongIndicator) &&
                          styles.optionLetterSelected,
                      ]}
                    >
                      {optionLetter}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.optionText,
                      (isSelected ||
                        showCorrectIndicator ||
                        showWrongIndicator) &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                  {showCorrectIndicator && (
                    <MaterialIcons
                      name="check-circle"
                      size={24}
                      color="#10B981"
                    />
                  )}
                  {showWrongIndicator && (
                    <MaterialIcons name="cancel" size={24} color="#DC2626" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Answer Feedback */}
        {showAnswer && (
          <View
            style={[
              styles.feedbackContainer,
              isCorrect ? styles.feedbackCorrect : styles.feedbackWrong,
            ]}
          >
            <View style={styles.feedbackHeader}>
              <MaterialIcons
                name={isCorrect ? "check-circle" : "cancel"}
                size={32}
                color={isCorrect ? "#10B981" : "#DC2626"}
              />
              <Text style={styles.feedbackTitle}>
                {isCorrect
                  ? "Parabéns! Resposta Correta!"
                  : "Resposta Incorreta"}
              </Text>
            </View>
            <Text style={styles.feedbackText}>
              {isCorrect
                ? "Você acertou a questão! Continue assim."
                : `A resposta correta é a opção ${question.answer}.`}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {!showAnswer ? (
            <TouchableOpacity
              style={[
                styles.submitButton,
                !selectedOption && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!selectedOption}
            >
              <Text style={styles.submitButtonText}>Enviar Resposta</Text>
              <MaterialIcons name="send" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleReset}
              >
                <MaterialIcons name="refresh" size={20} color="#4F46E5" />
                <Text style={styles.resetButtonText}>Tentar Novamente</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.nextButtonText}>Voltar</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  infoContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  examTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  examTypeText: {
    fontSize: 14,
    color: "#4F46E5",
    fontWeight: "600",
  },
  questionContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#111827",
  },
  optionsContainer: {
    marginTop: 8,
    marginHorizontal: 16,
  },
  optionsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 12,
  },
  optionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionCardSelected: {
    borderColor: "#4F46E5",
    backgroundColor: "#EEF2FF",
  },
  optionCardCorrect: {
    borderColor: "#10B981",
    backgroundColor: "#ECFDF5",
  },
  optionCardWrong: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  optionCircleSelected: {
    backgroundColor: "#4F46E5",
  },
  optionCircleCorrect: {
    backgroundColor: "#10B981",
  },
  optionCircleWrong: {
    backgroundColor: "#DC2626",
  },
  optionLetter: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6B7280",
  },
  optionLetterSelected: {
    color: "#FFFFFF",
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
  },
  optionTextSelected: {
    fontWeight: "600",
    color: "#111827",
  },
  feedbackContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  feedbackCorrect: {
    backgroundColor: "#ECFDF5",
    borderColor: "#10B981",
  },
  feedbackWrong: {
    backgroundColor: "#FEF2F2",
    borderColor: "#DC2626",
  },
  feedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
  },
  actionsContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  submitButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "#4F46E5",
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4F46E5",
  },
  nextButton: {
    flex: 1,
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bottomSpacing: {
    height: 20,
  },
});
