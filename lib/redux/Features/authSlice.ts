import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  username: string;
  email: string;
  avatar: string | null;
  credits: number;
  plan: "starter" | "pro" | "free";
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    updateCredits: (state, action: PayloadAction<number>) => {
      if (state.user) state.user.credits = action.payload;
    },
    updatePlan: (state, action: PayloadAction<"starter" | "pro">) => {
      if (state.user) state.user.plan = action.payload;
    },
  },
});

export const { loginSuccess, logoutSuccess, updateCredits, updatePlan } = authSlice.actions;
export default authSlice.reducer;