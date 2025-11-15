// app/(tabs)/profile/_layout.js
import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // hide top bar for clean look
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
