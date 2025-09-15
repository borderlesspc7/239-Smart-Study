import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface WeeklyProgressProps {
  weeklyGoal: number; // em minutos
  weeklyProgress: number; // em minutos
}

export const WeeklyProgress: React.FC<WeeklyProgressProps> = ({
  weeklyGoal,
  weeklyProgress,
}) => {
  const progressPercentage = Math.min((weeklyProgress / weeklyGoal) * 100, 100);
  const hoursGoal = Math.floor(weeklyGoal / 60);
  const minutesGoal = weeklyGoal % 60;
  const hoursProgress = Math.floor(weeklyProgress / 60);
  const minutesProgress = weeklyProgress % 60;

  const getProgressColor = () => {
    if (progressPercentage >= 100) return "#10B981";
    if (progressPercentage >= 75) return "#F59E0B";
    if (progressPercentage >= 50) return "#3B82F6";
    return "#EF4444";
  };

  const formatTime = (hours: number, minutes: number) => {
    if (hours === 0) return `${minutes}min`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}min`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialIcons name="trending-up" size={20} color="#4F46E5" />
          <Text style={styles.title}>Meta Semanal</Text>
        </View>
        <Text style={styles.percentage}>{Math.round(progressPercentage)}%</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${progressPercentage}%`,
                backgroundColor: getProgressColor(),
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          {formatTime(hoursProgress, minutesProgress)} de{" "}
          {formatTime(hoursGoal, minutesGoal)}
        </Text>
        {progressPercentage >= 100 && (
          <View style={styles.completedBadge}>
            <MaterialIcons name="check-circle" size={16} color="#10B981" />
            <Text style={styles.completedText}>Meta atingida!</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 8,
  },
  percentage: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4F46E5",
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBackground: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeText: {
    fontSize: 14,
    color: "#6B7280",
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  completedText: {
    fontSize: 12,
    color: "#10B981",
    fontWeight: "600",
    marginLeft: 4,
  },
});
