// client/screens/Home/HomeScreen.js
import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useUser } from "../../context/UserContext";
import { useEmotion } from "../../context/EmotionContext";
import { getBurnoutRisk } from "../../services/emotionService";
import { getJournals } from "../../services/journalService";
import BurnoutGauge from "../../components/BurnoutGauge";
import Chart from "../../components/Chart";
import { useFocusEffect } from "expo-router";

export default function HomeScreen() {
  const { user } = useUser();
  const { emotions, averageMood, addEmotion, clearEmotions } = useEmotion();
  const [burnout, setBurnout] = useState({ score: 0, status: "Low" });

  // Load burnout
  const fetchBurnout = useCallback(async () => {
    try {
      const res = await getBurnoutRisk();
      setBurnout(res);
    } catch (err) {
      console.log("Burnout fetch error:", err.message || err);
    }
  }, []);

  // Load journals → populate emotion history
  const fetchJournalEmotions = useCallback(async () => {
    try {
      const list = await getJournals();

      clearEmotions();

      list.forEach((j) =>
        addEmotion({
          date: j.date,
          emotion: j.detectedEmotion,
          score: j.sentimentScore,
        })
      );
    } catch (err) {
      console.log("Error loading journal emotions:", err);
    }
  }, []);

  // Load both burnout and emotion history on focus
  useFocusEffect(
    useCallback(() => {
      fetchBurnout();
      fetchJournalEmotions();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Hi {user?.name || "there"} 👋</Text>
      <Text style={styles.subtitle}>Your Emotional Overview</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Burnout Risk</Text>
        <BurnoutGauge riskScore={burnout.score} />
        <Text style={styles.burnoutStatus}>Status: {burnout.status}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Average Mood</Text>
        <Text style={styles.moodText}>{averageMood.toFixed(2)}</Text>
      </View>

      {emotions.length > 0 && (
        <View style={styles.section}>
          <Chart data={emotions.slice(-10)} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
    marginTop: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 20,
  },
  section: {
    marginVertical: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  burnoutStatus: {
    marginTop: 6,
    color: "#6B7280",
  },
  moodText: {
    fontSize: 22,
    color: "#4F46E5",
    fontWeight: "700",
  },
});
