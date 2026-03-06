import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

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
}

const initialState: UserState = {
  token: null,
  currentUser: null,
  isLoading: false,
};

// ✅ Créer et EXPORTER restoreSession
export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async () => {
    try {
      const [token, user] = await Promise.all([
        AsyncStorage.getItem("token"),
        AsyncStorage.getItem("user"),
      ]);
      
      if (token && user) {
        return { token, user: JSON.parse(user) };
      }
      return null;
    } catch (error) {
      console.error("Erreur lors de la restauration de la session:", error);
      return null;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token;
      state.currentUser = action.payload.user;
      AsyncStorage.setItem("token", action.payload.token);
      AsyncStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout(state) {
      state.token = null;
      state.currentUser = null;
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("user");
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

export const { loginSuccess, logout, setToken, setUser } = authSlice.actions;
export default authSlice.reducer;