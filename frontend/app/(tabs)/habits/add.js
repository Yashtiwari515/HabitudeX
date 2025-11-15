// client/screens/Habits/AddHabitScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import CustomButton from "../../../components/CustomButton";
import { useHabits } from "../../../context/HabitContext";
import { router } from "expo-router";

export default function AddHabitScreen() {
  const [title, setTitle] = useState("");
  const [relatedEmotion, setRelatedEmotion] = useState("neutral");

  const { addHabit } = useHabits();

  const handleAdd = async () => {
    if (!title.trim()) {
      return Alert.alert("Error", "Please enter a habit name");
    }

    try {
      await addHabit(title.trim(), relatedEmotion.toLowerCase());

      Alert.alert("Success", `Habit "${title}" added successfully!`);

      router.back(); // 👈 Expo router navigation
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to add habit.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Habit</Text>

      <TextInput
        style={styles.input}
        placeholder="Habit name (e.g., Meditation)"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Related Emotion:</Text>

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={relatedEmotion}
          onValueChange={(value) => setRelatedEmotion(value)}
        >
          <Picker.Item label="Happy" value="happy" />
          <Picker.Item label="Sad" value="sad" />
          <Picker.Item label="Angry" value="angry" />
          <Picker.Item label="Anxious" value="anxious" />
          <Picker.Item label="Tired" value="tired" />
          <Picker.Item label="Neutral" value="neutral" />
        </Picker>
      </View>

      <CustomButton title="Add Habit" onPress={handleAdd} />
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
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    fontSize: 15,
    marginBottom: 15,
  },
  label: { fontSize: 15, fontWeight: "600", marginBottom: 5 },
  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 20,
  },
});
