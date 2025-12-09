import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";

interface ProgressChartProps {
  title: string;
  data: number[];
  labels: string[];
  type?: "line" | "bar";
  color?: string;
}

const screenWidth = Dimensions.get("window").width;

export function ProgressChart({
  title,
  data,
  labels,
  type = "line",
  color = "#4F46E5",
}: ProgressChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        color: () => color,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartContainer}>
        {type === "line" ? (
          <LineChart
            data={chartData}
            width={screenWidth - 40}
            height={250}
            chartConfig={{
              backgroundColor: "#FFFFFF",
              backgroundGradientFrom: "#FFFFFF",
              backgroundGradientTo: "#FFFFFF",
              decimalPlaces: 0,
              color: () => "#D1D5DB",
              labelColor: () => "#6B7280",
              style: {
                borderRadius: 12,
              },
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: color,
              },
            }}
            bezier
            style={styles.chart}
          />
        ) : (
          <BarChart
            data={chartData}
            width={screenWidth - 40}
            height={250}
            yAxisLabel="Y-axis label" // ALTERADO - movido para o componente
            yAxisSuffix="units" // ALTERADO - movido para o componente
            chartConfig={{
              backgroundColor: "#FFFFFF",
              backgroundGradientFrom: "#FFFFFF",
              backgroundGradientTo: "#FFFFFF",
              decimalPlaces: 0,
              color: () => "#D1D5DB",
              labelColor: () => "#6B7280",
              style: {
                borderRadius: 12,
              },
            }}
            style={styles.chart}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 20,
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
  chartContainer: {
    alignItems: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 12,
  },
});
