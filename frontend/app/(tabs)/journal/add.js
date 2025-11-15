import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import CustomButton from "../../../components/CustomButton";
import { addJournal } from "../../../services/journalService";
import { useEmotion } from "../../../context/EmotionContext";

export default function AddJournalScreen() {
  const [entry, setEntry] = useState("");
  const [loading, setLoading] = useState(false);
  const { addEmotion } = useEmotion();
  const router = useRouter();

  const handleSave = async () => {
    if (!entry.trim()) {
      Alert.alert("Error", "Please write something in your journal.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Call backend API
      const result = await addJournal(entry);

      // ✅ Update emotion context for dashboard
      addEmotion({
        date: result.date,
        emotion: result.detectedEmotion,
        score: result.sentimentScore,
      });

      // ✅ Show success
      Alert.alert("Saved", `Emotion detected: ${result.detectedEmotion}`);

      // ✅ Go back to journal list
      router.back();
    } catch (err) {
      console.log("Journal Save Error:", err.response?.data || err.message);
      Alert.alert("Error", "Could not save journal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>New Journal Entry</Text>
      <Text style={styles.subText}>
        Express your thoughts — our AI will analyze your emotion.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Write your thoughts here..."
        placeholderTextColor="#9CA3AF"
        value={entry}
        onChangeText={setEntry}
        multiline
        numberOfLines={10}
      />

      <CustomButton
        title={loading ? "Analyzing..." : "Save & Analyze"}
        onPress={handleSave}
        loading={loading}
      />
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
    marginBottom: 10,
  },
  subText: {
    color: "#6B7280",
    marginBottom: 20,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    height: 180,
    textAlignVertical: "top",
    fontSize: 15,
    marginBottom: 20,
  },
});
