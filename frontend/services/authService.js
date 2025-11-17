// client/services/authService.js
import API from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Login existing user
 */
export const loginUser = async (email, password) => {
  const res = await API.post("/user/login", { email, password });

  // Save token
  await AsyncStorage.setItem("token", res.data.token);

  // RETURN the full user object
  return {
    _id: res.data._id,
    name: res.data.name,
    email: res.data.email,
  };
};

/**
 * Register a new user
 */
export const registerUser = async (name, email, password) => {
  const res = await API.post("/user/register", { name, email, password });

  await AsyncStorage.setItem("token", res.data.token);

  return {
    _id: res.data._id,
    name: res.data.name,
    email: res.data.email,
  };
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  await AsyncStorage.removeItem("token");
  global.authToken = null;
};
