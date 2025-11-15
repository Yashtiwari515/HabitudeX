// client/hooks/useHabits.js
import { useHabits as useHabitContext } from "../context/HabitContext";
import { useState } from "react";

export default function useHabits() {
  const { habits, addHabit, toggleHabit, deleteHabit } = useHabitContext();
  const [filter, setFilter] = useState("All");

  const filteredHabits =
    filter === "All"
      ? habits
      : habits.filter((h) =>
          filter === "Completed" ? h.completed : !h.completed
        );

  return {
    habits: filteredHabits,
    addHabit,
    toggleHabit,
    deleteHabit,
    filter,
    setFilter,
  };
}
