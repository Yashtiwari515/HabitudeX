// client/hooks/useAuth.js
import { useUser } from "../context/UserContext";
import { loginUser, registerUser } from "../services/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useAuth() {
  const { user, login, logout } = useUser();

  const handleLogin = async (email, password) => {
    const res = await loginUser(email, password);
    login(res.user);
    await AsyncStorage.setItem("token", res.token);
  };

  const handleRegister = async (name, email, password) => {
    const res = await registerUser(name, email, password);
    login(res.user);
    await AsyncStorage.setItem("token", res.token);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    logout();
  };

  return { user, handleLogin, handleRegister, handleLogout };
}
