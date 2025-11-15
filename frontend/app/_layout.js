// app/_layout.js
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActivityIndicator, View, useColorScheme } from "react-native";

import useAuthGuard from "../hooks/useAuthGuard"; 

import { UserProvider } from "../context/UserContext";
import { EmotionProvider } from "../context/EmotionContext";
import { HabitProvider } from "../context/HabitContext";
import { lightTheme, darkTheme } from "../styles/theme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const { isLoading } = useAuthGuard(); 

  if (isLoading) {
    // 🌀 Show loader while checking auth
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <UserProvider>
        <EmotionProvider>
          <HabitProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: theme.background },
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="Auth" />
            </Stack>
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          </HabitProvider>
        </EmotionProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
