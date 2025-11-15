// client/components/BurnoutGauge.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Svg, Circle } from "react-native-svg";

export default function BurnoutGauge({ riskScore = 0 }) {
  const radius = 40;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  let color = "#10B981";
  if (riskScore > 70) color = "#EF4444";
  else if (riskScore > 40) color = "#FBBF24";

  return (
    <View style={styles.container}>
      <Svg height="100" width="100">
        <Circle
          stroke="#E5E7EB"
          fill="none"
          cx="50"
          cy="50"
          r={normalizedRadius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={color}
          fill="none"
          cx="50"
          cy="50"
          r={normalizedRadius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={styles.text}>{riskScore}%</Text>
      <Text style={styles.label}>Burnout Risk</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  text: {
    position: "absolute",
    top: 38,
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  label: {
    marginTop: 8,
    color: "#6B7280",
    fontSize: 13,
  },
});
