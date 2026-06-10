import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { sessionCleared, sessionEstablished } from "./session.actions.ts";

type TSessionState = {
  accessToken: string | null;
  isAuth: boolean;
  isInitialized: boolean;
  status: "idle" | "loading" | "error";
};

const initialState: TSessionState = {
  accessToken: null,
  isAuth: false,
  isInitialized: false,
  status: "idle",
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<"idle" | "loading" | "error">) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sessionEstablished, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.isAuth = true;
        state.isInitialized = true;
        state.status = "idle";
      })
      .addCase(sessionCleared, (state) => {
        state.accessToken = null;
        state.isAuth = false;
        state.isInitialized = true;
        state.status = "idle";
      });
  },
});

export const { setStatus } = sessionSlice.actions;
export default sessionSlice.reducer;
