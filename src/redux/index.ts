import { combineReducers } from "@reduxjs/toolkit";

import users from "./slices/usersSlice";

export const rootReducer = combineReducers({
  users,
});
