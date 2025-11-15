// client/screens/Home/DashboardScreen.js
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useEmotion } from "../../context/EmotionContext";
import Chart from "../../components/Chart";

export default function DashboardScreen() {
  const { emotions } = useEmotion();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mood Dashboard</Text>
      {emotions.length > 0 ? (
        <Chart data={emotions.map((e) => ({ date: e.date, score: e.score }))} />
      ) : (
        <Text style={styles.placeholder}>
          No emotion data yet. Write a journal to begin!
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  placeholder: { color: "#9CA3AF", textAlign: "center", marginTop: 50 },
});
