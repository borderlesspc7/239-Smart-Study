"use client";

import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ReportHeaderProps {
  title: string;
  onPeriodChange?: (period: "month" | "semester" | "year") => void;
}

export function ReportHeader({ title, onPeriodChange }: ReportHeaderProps) {
  const [selectedPeriod, setSelectedPeriod] = React.useState<
    "month" | "semester" | "year"
  >("month");

  const handlePeriodChange = (period: "month" | "semester" | "year") => {
    setSelectedPeriod(period);
    onPeriodChange?.(period);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <MaterialIcons name="assessment" size={32} color="#4F46E5" />
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.periodSelector}>
        {(["month", "semester", "year"] as const).map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive,
            ]}
            onPress={() => handlePeriodChange(period)}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === period && styles.periodTextActive,
              ]}
            >
              {period === "month"
                ? "Mês"
                : period === "semester"
                ? "Semestre"
                : "Ano"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#F9FAFB",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginLeft: 12,
  },
  periodSelector: {
    flexDirection: "row",
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  periodButtonActive: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  periodText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  periodTextActive: {
    color: "#FFFFFF",
  },
});
