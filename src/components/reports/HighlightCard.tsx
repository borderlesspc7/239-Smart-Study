// ALTERADO
import * as LucideIcons from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

// ALTERADO
type LucideIconComponent = React.ComponentType<{
  size?: number;
  color?: string;
}>;

// ALTERADO
const IconMap: Record<string, LucideIconComponent> = Object.fromEntries(
  Object.entries(LucideIcons).filter(([, value]) => typeof value === "function")
) as Record<string, LucideIconComponent>;

interface HighlightCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string; // pode ser "Wallet", "User", etc.
  color: string;
  trend?: number;
}

export function HighlightCard({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
}: HighlightCardProps) {
  const trendColor =
    trend === undefined ? "#6B7280" : trend > 0 ? "#10B981" : "#EF4444";

  const TrendIcon =
    trend === undefined
      ? null
      : trend > 0
      ? IconMap["TrendingUp"] // ALTERADO
      : IconMap["TrendingDown"]; // ALTERADO

  const MainIcon = IconMap[icon]; // ALTERADO

  return (
    <View style={[styles.container, { borderLeftColor: color }]}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.valueContainer}>
          <Text style={[styles.value, { color }]}>{value}</Text>

          {trend !== undefined && TrendIcon && (
            <View style={styles.trendContainer}>
              <TrendIcon size={16} color={trendColor} /> {/* ALTERADO */}
              <Text style={[styles.trend, { color: trendColor }]}>
                {Math.abs(trend)}%
              </Text>
            </View>
          )}
        </View>

        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
        {MainIcon && <MainIcon size={28} color={color} />} {/* ALTERADO */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: "700",
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trend: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 2,
  },
  subtitle: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
});
