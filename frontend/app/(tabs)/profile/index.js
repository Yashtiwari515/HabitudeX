import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "../../../context/UserContext";
import { useEmotion } from "../../../context/EmotionContext";
import { useHabits } from "../../../context/HabitContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useUser();
  const { emotions, averageMood } = useEmotion();
  const { habits } = useHabits();

  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          await AsyncStorage.removeItem("token"); // remove token
          router.replace("/Auth/login"); // redirect to login
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.card}>
        <Text style={styles.name}>{user?.name || "User"}</Text>
        <Text style={styles.email}>{user?.email || "No email available"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Summary</Text>
        <Text style={styles.stat}>🧠 Journals Analyzed: {emotions.length}</Text>
        <Text style={styles.stat}>🏋️‍♂️ Habits Tracked: {habits.length}</Text>
        <Text style={styles.stat}>
          😊 Avg Mood Score:{" "}
          {isNaN(averageMood) ? "0.00" : averageMood.toFixed(2)}
        </Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: "700", color: "#111827" },
  email: { color: "#6B7280", fontSize: 14, marginTop: 4 },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  stat: { color: "#4B5563", marginBottom: 4 },
  logoutButton: {
    backgroundColor: "#EF4444",
    padding: 12,
    borderRadius: 10,
    marginTop: 40,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
