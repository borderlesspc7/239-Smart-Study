import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
}) => {
  return (
    <View style={[styles.container, { borderLeftColor: color }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        <View style={styles.iconContainer}>
          <MaterialIcons name={icon} size={28} color={color} />
        </View>
      </View>

      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
        {trend && (
          <View style={styles.trendContainer}>
            <MaterialIcons
              name={trend.isPositive ? "trending-up" : "trending-down"}
              size={16}
              color={trend.isPositive ? "#10B981" : "#EF4444"}
            />
            <Text
              style={[
                styles.trendText,
                { color: trend.isPositive ? "#10B981" : "#EF4444" },
              ]}
            >
              {Math.abs(trend.value)}%
            </Text>
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
    borderLeftWidth: 4,
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
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 2,
  },
});
