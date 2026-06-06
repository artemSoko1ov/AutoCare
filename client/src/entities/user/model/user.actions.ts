import { createAction } from "@reduxjs/toolkit";
import type { UserDto } from "@shared/contracts/auth";

export const currentUserUpdated = createAction<UserDto>("user/currentUserUpdated");
