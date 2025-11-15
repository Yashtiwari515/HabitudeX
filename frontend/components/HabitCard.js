// client/components/HabitCard.js
import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EmotionBadge from "./EmotionBadge";

export default function HabitCard({ habit, onToggle, onEdit, onDelete }) {
  if (!habit) return null;

  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();

  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  // console.log("Toggling habit:", habit._id);

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
      {/* Left Side - Toggle + Title */}
      <TouchableOpacity
        style={styles.leftSection}
        onPress={() => onToggle(habit._id)}
        onPressIn={pressIn}
        onPressOut={pressOut}
      >
        <Ionicons
          name={habit.completedDates?.length > 0 ? "checkbox" : "square-outline"}
          size={28}
          color={habit.completedDates?.length > 0 ? "#22c55e" : "#6b7280"}
        />

        <View style={styles.textBox}>
          <Text
            style={[styles.title, habit.completedDates?.length > 0 && styles.titleCompleted]}
          >
            {habit.title}
          </Text>

          <EmotionBadge emotion={habit.relatedEmotion} />
        </View>
      </TouchableOpacity>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => onEdit(habit)}>
          <Ionicons name="pencil" size={20} color="#111" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconBtn, styles.deleteBtn]}
          onPress={() => onDelete(habit)}
        >
          <Ionicons name="trash" size={20} color="#e11d48" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    // shadow
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  textBox: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: "line-through",
    color: "#6b7280",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  iconBtn: {
    padding: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  deleteBtn: {
    backgroundColor: "#fee2e2",
  },
});
