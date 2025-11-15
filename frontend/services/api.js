// client/services/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router"; // 👈 allows navigation outside components
import { Alert } from "react-native";

const API = axios.create({
  baseURL: "http://192.168.29.24:5000/api", // ⚠️ replace with your backend IP if needed
  timeout: 10000,
});

// ✅ Attach token to every request
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🚨 Handle token expiry or invalid token globally
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn(
        "⚠️ Unauthorized: clearing token and redirecting to login..."
      );

      // Clear token from storage
      await AsyncStorage.removeItem("token");

      // Inform the user
      Alert.alert("Session Expired", "Please log in again to continue.");

      // Redirect to login screen
      router.replace("/Auth/login");
    }

    // Propagate the error
    return Promise.reject(error);
  }
);

export default API;
