// frontend/components/JournalCard.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EmotionBadge from "./EmotionBadge";
import { deleteJournal } from "../services/journalService";
import * as Clipboard from "expo-clipboard"; // <-- Added

export default function JournalCard({ journal, onDelete }) {
  if (!journal) return null;

  const handleDelete = () => {
    Alert.alert(
      "Delete Journal",
      "Are you sure you want to delete this journal?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteJournal(journal._id);
              if (onDelete) onDelete(journal._id);
            } catch (err) {
              console.log("❌ Delete error:", err);
              Alert.alert("Error", "Could not delete journal");
            }
          },
        },
      ]
    );
  };

  // ✅ Copy Journal Text
  const handleCopy = async () => {
    await Clipboard.setStringAsync(journal.text);
    Alert.alert("Copied!", "Journal text copied to clipboard.");
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.date}>
          {new Date(journal.date).toLocaleString()}
        </Text>
        <View style={styles.actions}>
          <EmotionBadge emotion={journal.detectedEmotion} />

          {/* ✅ Copy Button */}
          <TouchableOpacity onPress={handleCopy}>
            <Ionicons name="copy-outline" size={22} color="#6B7280" />
          </TouchableOpacity>

          {/* Delete Button */}
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash-outline" size={22} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.text} numberOfLines={3}>
        {journal.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12, // wider spacing for clean UI
  },
  date: {
    color: "#6B7280",
    fontSize: 13,
  },
  text: {
    color: "#111827",
    fontSize: 15,
    lineHeight: 20,
  },
});
