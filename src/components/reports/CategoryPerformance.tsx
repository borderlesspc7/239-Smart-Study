import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { PerformanceByCategory } from "../../types/reports";

interface CategoryPerformanceProps {
  categories: PerformanceByCategory[];
  onCategoryPress?: (category: PerformanceByCategory) => void;
}

export function CategoryPerformance({
  categories,
  onCategoryPress,
}: CategoryPerformanceProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Performance por Matéria</Text>

      {categories.map((category, index) => (
        <TouchableOpacity
          key={index}
          style={styles.categoryItem}
          onPress={() => onCategoryPress?.(category)}
          activeOpacity={0.7}
        >
          <View style={styles.categoryHeader}>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{category.category}</Text>
              <Text style={styles.categoryStats}>
                {category.correct}/{category.total} questões
              </Text>
            </View>
            <View
              style={[
                styles.accuracyBadge,
                {
                  backgroundColor:
                    category.accuracy >= 80
                      ? "#D1FAE5"
                      : category.accuracy >= 60
                      ? "#FEF3C7"
                      : "#FEE2E2",
                },
              ]}
            >
              <Text
                style={[
                  styles.accuracyText,
                  {
                    color:
                      category.accuracy >= 80
                        ? "#065F46"
                        : category.accuracy >= 60
                        ? "#92400E"
                        : "#7F1D1D",
                  },
                ]}
              >
                {category.accuracy}%
              </Text>
            </View>
          </View>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${category.accuracy}%`,
                  backgroundColor:
                    category.accuracy >= 80
                      ? "#10B981"
                      : category.accuracy >= 60
                      ? "#F59E0B"
                      : "#EF4444",
                },
              ]}
            />
          </View>

          {category.trend !== 0 && (
            <View style={styles.trendContainer}>
              <MaterialIcons
                name={category.trend > 0 ? "trending-up" : "trending-down"}
                size={14}
                color={category.trend > 0 ? "#10B981" : "#EF4444"}
              />
              <Text
                style={[
                  styles.trendText,
                  {
                    color: category.trend > 0 ? "#10B981" : "#EF4444",
                  },
                ]}
              >
                {category.trend > 0 ? "+" : ""}
                {category.trend}% em relação ao mês anterior
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  categoryItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  categoryStats: {
    fontSize: 12,
    color: "#6B7280",
  },
  accuracyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  accuracyText: {
    fontSize: 14,
    fontWeight: "700",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
});
