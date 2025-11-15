// client/services/authService.js
import API from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Login existing user
 */
export const loginUser = async (email, password) => {
  const res = await API.post("/user/login", { email, password });
  const { token, user } = res.data;

  // Save token securely for authenticated requests
  await AsyncStorage.setItem("token", token);

  // Optional: keep token globally accessible
  global.authToken = token;

  return user;
};

/**
 * Register a new user
 */
export const registerUser = async (name, email, password) => {
  const res = await API.post("/user/register", { name, email, password });
  const { token, user } = res.data;

  // Save token securely right after registration
  await AsyncStorage.setItem("token", token);

  // Optional: set globally for immediate use
  global.authToken = token;

  return user;
};

/**
 * Logout user 
 */
export const logoutUser = async () => {
  await AsyncStorage.removeItem("token");
  global.authToken = null;
};
