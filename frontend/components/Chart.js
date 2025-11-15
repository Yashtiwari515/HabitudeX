// client/components/Chart.js
import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function EmotionTrendChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Emotion Trend</Text>
        <Text style={styles.placeholder}>Not enough data yet</Text>
      </View>
    );
  }

  // Convert ISO -> short readable labels
  const labels = data.map((d) =>
    new Date(d.date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    })
  );

  const values = data.map((d) => Number(d.score.toFixed(2)));

  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 40; // perfect for card padding

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emotion Trend</Text>

      <LineChart
        data={{
          labels,
          datasets: [{ data: values }],
        }}
        width={chartWidth}
        height={220}
        withVerticalLines={false}
        withHorizontalLines={true}
        withDots={true}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
          labelColor: () => "#6B7280",
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#4F46E5",
          },
        }}
        bezier
        style={{
          marginTop: 10,
          borderRadius: 10,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,

    // Prevent chart overflow from card edges
    overflow: "hidden",

    // nice shadow
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  placeholder: {
    color: "#9CA3AF",
    marginTop: 10,
  },
});
