// frontend/app/(tabs)/journal/index.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import JournalCard from "../../../components/JournalCard";
import { getJournals } from "../../../services/journalService";
import { useEmotion } from "../../../context/EmotionContext";
import { Ionicons } from "@expo/vector-icons";

export default function JournalScreen() {
  const router = useRouter();
  const [journals, setJournals] = useState([]);
  const { addEmotion } = useEmotion();

  const fetchJournals = async () => {
    try {
      const data = await getJournals();

      // Debug: show what backend returns
      // console.log("📘 Journals fetched from backend:", data);

      // Ensure we have an array
      const list = Array.isArray(data) ? data : [];

      setJournals(list);

      // Update emotion context (only if data present)
      list.forEach((j) =>
        addEmotion({
          date: j.date,
          emotion: j.detectedEmotion,
          score: j.sentimentScore,
        })
      );
    } catch (err) {
      console.log("❌ Error fetching journals:", err);
    }
  };

  // Refresh whenever screen focuses
  useFocusEffect(
    useCallback(() => {
      fetchJournals();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Journals</Text>

      {/* Debug count so we can see if data is coming */}
      <Text style={styles.debugText}>Showing {journals.length} journal(s)</Text>

      {journals.length === 0 ? (
        <Text style={styles.placeholder}>
          No journals yet. Add your first entry!
        </Text>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={journals}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <JournalCard
              journal={item}
              onDelete={(id) =>
                setJournals((prev) => prev.filter((j) => j._id !== id))
              }
            />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/(tabs)/journal/add")}
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
  placeholder: { textAlign: "center", color: "#9CA3AF", marginTop: 50 },
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
