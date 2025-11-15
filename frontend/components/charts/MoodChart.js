// client/components/charts/MoodChart.js
import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";

const CARD_HORIZONTAL_PADDING = 20;
const CARD_INTERNAL_PADDING = 16;
const SIDE_GUTTER = CARD_HORIZONTAL_PADDING + CARD_INTERNAL_PADDING;

export default function MoodChart({ data = [] }) {
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = Math.max(240, screenWidth - SIDE_GUTTER - 16); // safe min width

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Mood Trend (%)</Text>
        <Text style={styles.placeholder}>No mood data yet</Text>
      </View>
    );
  }

  const labels = data.map((d) =>
    new Date(d.date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    })
  );

  const scores = data.map((d) => Math.round((d.score ?? 0) * 100));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood Trend (%)</Text>

      <LineChart
        data={{
          labels,
          datasets: [{ data: scores }],
        }}
        width={chartWidth}
        height={200}
        yAxisSuffix="%"
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(79,70,229, ${opacity})`,
          labelColor: () => "#6B7280",
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#4F46E5",
          },
        }}
        bezier
        style={styles.chart}
        withVerticalLines={false}
        withInnerLines={true}
        withOuterLines={false}
        fromZero
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: CARD_INTERNAL_PADDING,
    marginVertical: 10,
    // Ensure children don't overflow rounded corners
    overflow: "hidden",
  },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 8, color: "#111827" },
  placeholder: { color: "#9CA3AF" },
  chart: {
    borderRadius: 8,
    marginLeft: -8, // small shift so labels don't clip
  },
});
