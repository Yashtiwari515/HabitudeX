// client/components/charts/BurnoutChart.js
import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";

export default function BurnoutChart({ stats }) {
  if (!stats || !stats.breakdown) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Burnout Overview</Text>
        <Text style={styles.placeholder}>No burnout data yet</Text>
      </View>
    );
  }

  const { breakdown, score } = stats;

  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 40;

  const barData = {
    labels: ["Volatility", "Stress", "Habits"],
    datasets: [
      {
        data: [
          breakdown.volatility || 0,
          Math.min(breakdown.stressCount * 10, 100), // convert count → 0–100
          breakdown.habitDrop || 0,
        ],
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Burnout Breakdown (%)</Text>

      <BarChart
        data={barData}
        width={chartWidth}
        height={220}
        fromZero
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity) => `rgba(239, 68, 68, ${opacity})`,
          labelColor: () => "#6b7280",
        }}
        verticalLabelRotation={0}
        style={styles.chart}
      />

      <View style={styles.scoreBox}>
        <Text style={styles.scoreText}>Overall Burnout: {score}%</Text>
        <Text style={styles.statusText}>Status: {stats.status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    overflow: "hidden",
  },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  placeholder: { color: "#9CA3AF" },
  chart: { borderRadius: 8, marginTop: 8 },
  scoreBox: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#fee2e2",
    borderRadius: 8,
  },
  scoreText: { color: "#b91c1c", fontWeight: "700", textAlign: "center" },
  statusText: {
    color: "#6b7280",
    textAlign: "center",
    marginTop: 4,
  },
});
