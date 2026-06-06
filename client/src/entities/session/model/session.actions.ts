import { createAction } from "@reduxjs/toolkit";
import type { UserDto } from "@shared/contracts/auth";

type SessionEstablishedPayload = {
  user: UserDto;
  accessToken: string;
};

export const sessionEstablished = createAction<SessionEstablishedPayload>(
  "session/sessionEstablished",
);
export const sessionCleared = createAction("session/sessionCleared");
