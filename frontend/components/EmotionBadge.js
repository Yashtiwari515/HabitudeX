// client/components/EmotionBadge.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const emotionData = {
  happy: { color: "#34D399", icon: "😊" },
  sad: { color: "#60A5FA", icon: "😢" },
  angry: { color: "#F87171", icon: "😡" },
  anxious: { color: "#FBBF24", icon: "😟" },
  tired: { color: "#A78BFA", icon: "😴" },
  neutral: { color: "#9CA3AF", icon: "😐" },
};

export default function EmotionBadge({ emotion = "neutral" }) {
  const key = emotion.toLowerCase();
  const data = emotionData[key] || emotionData.neutral;

  const label = key.charAt(0).toUpperCase() + key.slice(1);

  return (
    <View style={[styles.badge, { backgroundColor: data.color }]}>
      <Text style={styles.text}>
        {data.icon} {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
});
