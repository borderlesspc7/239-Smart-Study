import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Question } from "../../models/question";

interface QuestionCardProps {
  question: Question;
  onPress: (question: Question) => void;
}

export function QuestionCard({ question, onPress }: QuestionCardProps) {
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

  const getQuestionPreview = (text: string) => {
    // Remove as opções de resposta para mostrar apenas a pergunta
    const questionOnly = text.split("\n\nA)")[0];
    return questionOnly.length > 120
      ? questionOnly.substring(0, 120) + "..."
      : questionOnly;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(question)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{question.category}</Text>
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: getDifficultyColor(question.difficulty) },
            ]}
          >
            <Text style={styles.difficultyText}>{question.difficulty}</Text>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
      </View>

      <Text style={styles.questionText}>
        {getQuestionPreview(question.question)}
      </Text>

      <View style={styles.footer}>
        <View style={styles.typeContainer}>
          <MaterialIcons name="quiz" size={16} color="#6B7280" />
          <Text style={styles.typeText}>{question.type}</Text>
        </View>
        <Text style={styles.optionsCount}>
          {question.options.length} opções
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  category: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4F46E5",
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  questionText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  typeText: {
    fontSize: 12,
    color: "#6B7280",
  },
  optionsCount: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});
