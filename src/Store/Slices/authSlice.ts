import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "admin" | "cashier" | "waiter" | "chef";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean; // true on app boot — waiting for /auth/me
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // ← IMPORTANT: prevents flash of /login on refresh
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Called after login OR /auth/me success
    setCredentials(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    // Called on logout or /auth/me failure
    clearCredentials(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    // Called while /auth/me is in flight
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, clearCredentials, setAuthLoading } =
  authSlice.actions;
export default authSlice.reducer;
