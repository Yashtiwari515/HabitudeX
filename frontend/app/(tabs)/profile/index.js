import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useUser } from "../../../context/UserContext";
import { useEmotion } from "../../../context/EmotionContext";
import { useHabits } from "../../../context/HabitContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { emotions, averageMood } = useEmotion();
  const { habits } = useHabits();

  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          router.replace("/Auth/login");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 🌿 Emerald Gradient Header */}
      <LinearGradient
        colors={["#34D399", "#10B981", "#059669"]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Profile</Text>

        <View style={styles.avatarBox}>
          <Image
            source={{
              uri:
                user?.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user?.name || "User"}</Text>
          <Text style={styles.email}>{user?.email || "No Email"}</Text>
        </View>
      </LinearGradient>

      {/* Summary Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 App Summary</Text>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>🧠 Journals Analyzed</Text>
          <Text style={styles.statValue}>{emotions.length}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>🏋️‍♂️ Habits Tracked</Text>
          <Text style={styles.statValue}>{habits.length}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>😊 Avg Mood Score</Text>
          <Text style={styles.statValue}>
            {isNaN(averageMood) ? "0.00" : averageMood.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const EMERALD = "#10B981";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  // 🌿 Gradient Header
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  avatarBox: {
    marginTop: 20,
    alignItems: "center",
  },
  avatar: {
    width: 85,
    height: 85,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  email: {
    fontSize: 14,
    color: "#E5E7EB",
    marginTop: 3,
  },

  // Summary Card
  card: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    padding: 18,
    borderRadius: 18,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },

  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 15,
    color: "#4B5563",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: EMERALD,
  },

  // Logout Button
  logoutButton: {
    backgroundColor: "#EF4444",
    marginHorizontal: 40,
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
    elevation: 3,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
