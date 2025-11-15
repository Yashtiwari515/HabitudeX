// client/app/(tabs)/habit/index.js
import React, { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import HabitCard from "../../../components/HabitCard";
import { useHabits } from "../../../context/HabitContext";
import { Ionicons } from "@expo/vector-icons";

export default function HabitListScreen() {
  const router = useRouter();
  const { habits, loadHabits, toggleHabit, deleteHabit, updateHabit, loading } =
    useHabits();

  // 🔥 Load habits every time the Habits tab becomes active
  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [])
  );

  const handleDelete = (habit) => {
    Alert.alert(
      "Delete Habit?",
      `Are you sure you want to delete "${habit.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteHabit(habit._id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Habits</Text>

      <Text style={styles.debugText}>Showing {habits.length} habit(s)</Text>

      {loading && (
        <Text style={{ color: "#6B7280", marginBottom: 10 }}>Loading...</Text>
      )}

      {habits.length === 0 ? (
        <Text style={styles.placeholder}>
          No habits yet. Add one to get started!
        </Text>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <HabitCard
              habit={item}
              onToggle={toggleHabit}
              onEdit={() => console.log("Edit feature here")}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/(tabs)/habit/add")}
      >
        <Ionicons name="add" size={28} color="#fff" />
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
    marginBottom: 8,
  },
  debugText: {
    color: "#374151",
    marginBottom: 12,
  },
  placeholder: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 50,
  },
  addButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 50,
    width: 60,
    height: 60,
    position: "absolute",
    bottom: 30,
    right: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
});
