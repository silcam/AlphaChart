import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../models/User";
import { AppDispatch } from "./appState";
import { webGet } from "../api/apiRequest";

const userSlice = createSlice({
  name: "users",
  initialState: [] as User[],
  reducers: {
    setUsers: (_, action: PayloadAction<User[]>) => action.payload,
    addUser: (state, action: PayloadAction<User>) => [...state, action.payload]
  }
});

export default userSlice;

export function loadUsers() {
  return async (dispatch: AppDispatch) => {
    const users = await webGet("/users", {});
    if (users) dispatch(userSlice.actions.setUsers(users));
  };
}
