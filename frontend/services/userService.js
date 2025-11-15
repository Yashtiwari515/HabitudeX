// client/services/userService.js
import API from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const registerUser = async (name, email, password) => {
  const res = await API.post("/user/register", { name, email, password });
  const { token, user } = res.data;
  await AsyncStorage.setItem("token", token);
  global.authToken = token;
  return { user };
};

export const loginUser = async (email, password) => {
  const res = await API.post("/user/login", { email, password });
  const { token, user } = res.data;
  await AsyncStorage.setItem("token", token);
  global.authToken = token;
  return { user };
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem("token");
  global.authToken = null;
};
