import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useEmotion } from "../../../context/EmotionContext";
import { useFocusEffect } from "expo-router";
import MoodChart from "../../../components/charts/MoodChart";
import BurnoutChart from "../../../components/charts/BurnoutChart";
import { getBurnout } from "../../../services/burnoutService";

export default function DashboardScreen() {
  const { emotions } = useEmotion();
  const [burnout, setBurnout] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadBurnout = async () => {
    try {
      const data = await getBurnout();
      setBurnout(data);
    } catch (err) {
      console.log("Error loading burnout:", err);
    }
  };

  // Load on focus of dashboard tab
  useFocusEffect(
    useCallback(() => {
      loadBurnout();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBurnout();
    setRefreshing(false);
  };

  const moodData = (emotions || []).slice(-14);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.header}>Dashboard</Text>

      <MoodChart data={moodData} />

      <BurnoutChart stats={burnout} />

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6", marginTop: 40 },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
});
