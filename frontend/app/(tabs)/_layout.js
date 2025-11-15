// app/(tabs)/_layout.js
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#4F46E5",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0,
          height: 60,
        },

        // ICONS
        tabBarIcon: ({ color, size }) => {
          let icon;

          if (route.name === "index") icon = "home-outline";
          else if (route.name === "habits") icon = "list-outline";
          else if (route.name === "journal") icon = "book-outline";
          else if (route.name === "profile") icon = "person-outline";
          else if (route.name === "dashboard") icon = "analytics-outline"; // <-- ADDED

          return <Ionicons name={icon} size={24} color={color} />;
        },
      })}
    >
      {/* The order of these tabs is what appears in bottom bar */}
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="habits" options={{ title: "Habits" }} />
      <Tabs.Screen name="journal" options={{ title: "Journal" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
    </Tabs>
  );
}
