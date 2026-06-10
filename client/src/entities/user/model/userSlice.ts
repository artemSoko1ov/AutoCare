import { createSlice } from "@reduxjs/toolkit";
import type { UserDto } from "@shared/contracts/auth";
import { sessionCleared, sessionEstablished } from "@/entities/session/model/session.actions.ts";
import { currentUserUpdated } from "./user.actions.ts";

type TUserState = {
  currentUser: UserDto | null;
};

const initialState: TUserState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sessionEstablished, (state, action) => {
        state.currentUser = action.payload.user;
      })
      .addCase(currentUserUpdated, (state, action) => {
        state.currentUser = action.payload;
      })
      .addCase(sessionCleared, (state) => {
        state.currentUser = null;
      });
  },
});

export default userSlice.reducer;
