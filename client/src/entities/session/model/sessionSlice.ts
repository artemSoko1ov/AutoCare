import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserDto } from "@shared/contracts/auth";

type TSessionState = {
  user: UserDto | null;
  accessToken: string | null;
  isAuth: boolean;
  isInitialized: boolean;
  status: "idle" | "loading" | "error";
};

const initialState: TSessionState = {
  user: null,
  accessToken: null,
  isAuth: false,
  isInitialized: false,
  status: "idle",
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: UserDto; accessToken: string }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuth = true;
      state.isInitialized = true;
      state.status = "idle";
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuth = false;
      state.isInitialized = true;
      state.status = "idle";
    },
    setStatus: (state, action: PayloadAction<"idle" | "loading" | "error">) => {
      state.status = action.payload;
    },
  },
});

export const { setCredentials, logout, setStatus } = sessionSlice.actions;
export default sessionSlice.reducer;
