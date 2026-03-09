import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Platform } from "react-native";

interface User {
  id: number;
  email: string;
  nom?: string;
  prenom?: string;
  role?: string;
}

interface UserState {
  token: string | null;
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  token: null,
  currentUser: null,
  isLoading: false,
  error: null,
};

// Safe storage wrapper pour éviter les erreurs
const safeStorage = {
  async setItem(key: string, value: string) {
    try {
      // Vérifier si AsyncStorage est disponible (côté client)
      if (typeof window !== "undefined" && Platform.OS !== "web") {
        await AsyncStorage.setItem(key, value);
      } else if (Platform.OS === "web") {
        // Fallback pour web avec localStorage
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn(`Storage error for ${key}:`, error);
    }
  },

  async getItem(key: string) {
    try {
      if (typeof window !== "undefined" && Platform.OS !== "web") {
        return await AsyncStorage.getItem(key);
      } else if (Platform.OS === "web") {
        return localStorage.getItem(key);
      }
      return null;
    } catch (error) {
      console.warn(`Storage error for ${key}:`, error);
      return null;
    }
  },

  async removeItem(key: string) {
    try {
      if (typeof window !== "undefined" && Platform.OS !== "web") {
        await AsyncStorage.removeItem(key);
      } else if (Platform.OS === "web") {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Storage error for ${key}:`, error);
    }
  },
};

// Async thunk pour restaurer la session
export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async () => {
    try {
      const [token, user] = await Promise.all([
        safeStorage.getItem("token"),
        safeStorage.getItem("user"),
      ]);

      if (token && user) {
        return { token, user: JSON.parse(user) };
      }
      return null;
    } catch (error) {
      console.error("Erreur lors de la restauration de la session:", error);
      return null;
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token;
      state.currentUser = action.payload.user;
      state.isLoading = false;
      state.error = null;

      // Persistance avec safeStorage
      safeStorage.setItem("token", action.payload.token);
      safeStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.token = null;
      state.currentUser = null;
      state.isLoading = false;
      state.error = null;

      // Nettoyage avec safeStorage
      safeStorage.removeItem("token");
      safeStorage.removeItem("user");
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.token = action.payload.token;
          state.currentUser = action.payload.user;
        }
        state.isLoading = false;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setToken,
  setUser,
} = authSlice.actions;

export default authSlice.reducer;
