import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

export default function EditHabitModal({ visible, habit, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [emotion, setEmotion] = useState("neutral");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (habit) {
      setTitle(habit.title);
      setFrequency(habit.frequency);
      setEmotion(habit.relatedEmotion);
    }
  }, [habit]);

  const handleSave = async () => {
    setLoading(true);
    await onSave({
      title: title.trim(),
      frequency,
      relatedEmotion: emotion,
    });
    setLoading(false);
    onClose();
  };

  if (!habit) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.header}>Edit Habit</Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Habit Title"
            style={styles.input}
          />

          <TextInput
            value={frequency}
            onChangeText={setFrequency}
            placeholder="daily / weekly"
            style={styles.input}
          />

          <TextInput
            value={emotion}
            onChangeText={setEmotion}
            placeholder="related emotion"
            style={styles.input}
          />

          <View style={styles.row}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  container: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
  cancelText: { fontWeight: "600" },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#111",
    borderRadius: 10,
  },
  saveText: { color: "#fff", fontWeight: "700" },
});
