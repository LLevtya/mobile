import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/api";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isCheckingAuth: true,

  register: async (name, username, email, password) => {
  set({ isLoading: true });
  try {
    const response = await fetch("https://yalm-app-project.onrender.com/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Something went wrong");

    // ❗ Only store token/user if verified
    if (data.user?.isVerified) {
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", data.token);
      set({ token: data.token, user: data.user, isLoading: false });
    } else {
      set({ isLoading: false });
    }

    return { success: true, user: data.user }; // 👈 Add user here
  } catch (error) {
    set({ isLoading: false });
    return { success: false, error: error.message };
  }
},

verifyResetCode: async (email, code) => {
  try {
    const res = await fetch("https://yalm-app-project.onrender.com/api/auth/verify-reset-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Verification failed");

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
},


  login: async (email, password) => {
  set({ isLoading: true });

  try {
    const response = await fetch("https://yalm-app-project.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    // 👇 Handle unverified user (403 Forbidden)
    if (response.status === 403) {
      set({ isLoading: false });
      return { success: false, error: "UNVERIFIED", email };
    }

    if (!response.ok) throw new Error(data.message || "Something went wrong");

    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    await AsyncStorage.setItem("token", data.token);

    set({ token: data.token, user: data.user, isLoading: false });

    return { success: true };
  } catch (error) {
    set({ isLoading: false });
    return { success: false, error: error.message };
  }
},

resetPassword: async (email, newPassword) => {
  try {
    const res = await fetch("https://yalm-app-project.onrender.com/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Password reset failed");

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
},


  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;

      set({ token, user });
    } catch (error) {
      console.log("Auth check failed", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    set({ token: null, user: null });
  },
}));
