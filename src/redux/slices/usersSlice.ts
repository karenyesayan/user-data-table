import { createSlice } from "@reduxjs/toolkit";
import { usersExtraReducer } from "../thunks/usersThunk";
import { UsersState } from "../../lib/definitions";
import { RootState } from "../store";

const initialState = {
  users: [],
  total: 0,
  loading: false,
  errorMessage: null,
} satisfies UsersState as UsersState;

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    usersExtraReducer(builder);
  },
});

export const usersSelector = (state: RootState) => state.users.users;
export const usersLoadingSelector = (state: RootState) => state.users.loading;
export const usersErrorSelector = (state: RootState) =>
  state.users.errorMessage;
export const usersTotalSelector = (state: RootState) => state.users.total;

export default usersSlice.reducer;
