// client/context/HabitContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../services/api";
import { useUser } from "./UserContext";

const HabitContext = createContext();

export const HabitProvider = ({ children }) => {
  const { user, loading: userLoading } = useUser();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);

  // --------------------------
  // Load habits when:
  // 1. UserContext finished restoring user
  // 2. User exists
  // 3. Token exists in AsyncStorage
  // --------------------------
  // useEffect(() => {
  //   const tryLoad = async () => {
  //     if (userLoading) {
  //       console.log("[Habit] Waiting: userLoading still true");
  //       return;
  //     }

  //     if (!user) {
  //       console.log("[Habit] No user. Clearing habits.");
  //       setHabits([]);
  //       return;
  //     }

  //     const token = await AsyncStorage.getItem("token");
  //     if (!token) {
  //       console.log("[Habit] No token yet. Skipping load.");
  //       return;
  //     }

  //     console.log("[Habit] User + token ready → Loading habits");
  //     loadHabits();
  //   };

  //   tryLoad();
  // }, [userLoading, user]);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const res = await API.get("/habit");
      console.log("[Habit] Loaded", res.data.length, "habits");
      setHabits(res.data);
    } catch (err) {
      console.log(
        "[Habit] Error loading habits:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (title, relatedEmotion) => {
    try {
      const res = await API.post("/habit", { title, relatedEmotion });
      setHabits((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      console.log("❌ Error adding habit:", err.response?.data || err.message);
      throw err;
    }
  };

  const toggleHabit = async (id) => {
    try {
      const res = await API.put(`/habit/${id}/complete`);
      setHabits((prev) => prev.map((h) => (h._id === id ? res.data : h)));
    } catch (err) {
      console.log(
        "❌ Error toggling habit:",
        err.response?.data || err.message
      );
    }
  };

  const updateHabit = async (id, data) => {
    try {
      const res = await API.put(`/habit/${id}`, data);
      setHabits((prev) => prev.map((h) => (h._id === id ? res.data : h)));
    } catch (err) {
      console.log(
        "❌ Error updating habit:",
        err.response?.data || err.message
      );
    }
  };

  const deleteHabit = async (id) => {
    try {
      await API.delete(`/habit/${id}`);
      setHabits((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      console.log(
        "❌ Error deleting habit:",
        err.response?.data || err.message
      );
    }
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        addHabit,
        toggleHabit,
        updateHabit,
        deleteHabit,
        loading,
        loadHabits
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => useContext(HabitContext);
