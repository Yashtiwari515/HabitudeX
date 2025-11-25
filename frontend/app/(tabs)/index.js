// client/screens/Home/HomeScreen.js
import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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

  const fetchBurnout = useCallback(async () => {
    try {
      const res = await getBurnoutRisk();
      setBurnout(res);
    } catch (err) {
      console.log("Burnout fetch error:", err.message || err);
    }
  }, []);

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

  useFocusEffect(
    useCallback(() => {
      fetchBurnout();
      fetchJournalEmotions();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      {/* 🌿 Emerald Gradient Header */}
      <LinearGradient
        colors={["#34D399", "#10B981", "#059669"]}
        style={styles.headerCard}
      >
        <Text style={styles.headerText}>Hello, {user?.name || "there"} 👋</Text>
        <Text style={styles.headerSub}>Here’s your emotional summary</Text>
      </LinearGradient>

      {/* Burnout Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔥 Burnout Risk</Text>
        <BurnoutGauge riskScore={burnout.score} />
        <Text style={styles.burnoutStatus}>Status: {burnout.status}</Text>
      </View>

      {/* Mood Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>😊 Average Mood</Text>
        <Text style={styles.moodText}>{averageMood.toFixed(2)}</Text>
      </View>

      {/* Chart Section */}
      {emotions.length > 0 && (
        <View style={[styles.card, styles.chartCard]}>
          <Text style={styles.cardTitle}>📈 Mood Trend</Text>
          <Chart data={emotions.slice(-10)} />
        </View>
      )}
    </ScrollView>
  );
}

const EMERALD = "#10B981";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  // 🌿 Emerald Gradient Header
  headerCard: {
    padding: 28,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 6,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  headerSub: {
    marginTop: 6,
    fontSize: 16,
    color: "#ECFDF5",
  },

  // Card UI
  card: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },

  burnoutStatus: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 15,
  },

  moodText: {
    fontSize: 32,
    color: EMERALD,
    fontWeight: "800",
    alignSelf: "center",
  },

  chartCard: {
    paddingBottom: 25,
  },
});
