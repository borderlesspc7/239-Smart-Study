import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { QuestionFilter } from "../../models/question";
import { categories } from "../../models/question";

interface QuestionFiltersProps {
  filters: QuestionFilter;
  onFiltersChange: (filters: QuestionFilter) => void;
  onClearFilters: () => void;
}

const difficulties = ["Fácil", "Médio", "Difícil"] as const;

export function QuestionFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: QuestionFiltersProps) {
  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    const newFilters = {
      ...filters,
      categoryId: filters.categoryId === categoryId ? undefined : categoryId,
      category: filters.categoryId === categoryId ? undefined : categoryName,
    };
    onFiltersChange(newFilters);
  };

  const handleDifficultySelect = (
    difficulty: (typeof difficulties)[number]
  ) => {
    const newFilters = {
      ...filters,
      difficulty: filters.difficulty === difficulty ? undefined : difficulty,
    };
    onFiltersChange(newFilters);
  };

  const hasActiveFilters = filters.categoryId || filters.difficulty;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Filtros</Text>
        {hasActiveFilters && (
          <TouchableOpacity onPress={onClearFilters} style={styles.clearButton}>
            <MaterialIcons name="clear" size={20} color="#DC2626" />
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Categorias */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Matérias</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalList}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                filters.categoryId === category.id && styles.categoryChipActive,
              ]}
              onPress={() => handleCategorySelect(category.id, category.name)}
            >
              <Text
                style={[
                  styles.categoryText,
                  filters.categoryId === category.id &&
                    styles.categoryTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Dificuldade */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dificuldade</Text>
        <View style={styles.difficultyContainer}>
          {difficulties.map((difficulty) => (
            <TouchableOpacity
              key={difficulty}
              style={[
                styles.difficultyChip,
                filters.difficulty === difficulty &&
                  styles.difficultyChipActive,
              ]}
              onPress={() => handleDifficultySelect(difficulty)}
            >
              <Text
                style={[
                  styles.difficultyText,
                  filters.difficulty === difficulty &&
                    styles.difficultyTextActive,
                ]}
              >
                {difficulty}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    margin: 16,
    padding: 16,
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
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  clearText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#DC2626",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  horizontalList: {
    marginHorizontal: -4,
  },
  categoryChip: {
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  categoryChipActive: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  difficultyContainer: {
    flexDirection: "row",
    gap: 8,
  },
  difficultyChip: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  difficultyChipActive: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  difficultyTextActive: {
    color: "#FFFFFF",
  },
});
