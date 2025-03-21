import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { UsersState } from "../../lib/definitions";

export const fetchUsers = createAsyncThunk(
  "users/fetch",
  async (query: string) => {
    const response = await fetch(`https://dummyjson.com/users${query}`);
    return (await response.json()) as {};
  }
);

const fetchUsersPending = (state: UsersState) => {
  state.loading = true;
};

const fetchUsersFulfilled = (state: UsersState, { payload }: any) => {
  state.loading = false;
  (state.total = payload.total), (state.users = payload.users);
};

const fetchUsersRejected = (state: UsersState) => {
  state.loading = false;
  state.errorMessage = "Some error occurred with users";
};

export const usersExtraReducer = (
  builder: ActionReducerMapBuilder<UsersState>
) => {
  builder
    .addCase(fetchUsers.pending, fetchUsersPending)
    .addCase(fetchUsers.fulfilled, fetchUsersFulfilled)
    .addCase(fetchUsers.rejected, fetchUsersRejected);
};
