import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../models/User";
import { AppDispatch } from "./appState";
import { webGet } from "../api/apiRequest";
import { LoadAction } from "./LoadAction";
import { modelListMerge } from "../util/arrayUtils";

const userSlice = createSlice({
  name: "users",
  initialState: [] as User[],
  reducers: {
    addUser: (state, action: PayloadAction<User>) => [...state, action.payload]
  },
  extraReducers: {
    ACLoad: (state, action: LoadAction) =>
      modelListMerge(state, action.payload.users)
  }
});

export default userSlice;

// export function loadUsers() {
//   return async (dispatch: AppDispatch) => {
//     const users = await webGet("/users", {});
//     if (users) dispatch(userSlice.actions.setUsers(users));
//   };
// }
