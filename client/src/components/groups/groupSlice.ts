import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Group, groupCompare, NewGroup } from "../../models/Group";
import { AppDispatch } from "../../state/appState";
import { webGet, webPost } from "../../api/apiRequest";

const groupSlice = createSlice({
  name: "groups",
  initialState: [] as Group[],
  reducers: {
    setGroups: (_, action: PayloadAction<Group[]>) =>
      action.payload.sort(groupCompare),
    addGroup: (state, action: PayloadAction<Group>) =>
      [...state, action.payload].sort(groupCompare),
    updateGroup: (state, action: PayloadAction<Group>) =>
      [...state.filter(g => g.id != action.payload.id), action.payload].sort(
        groupCompare
      )
  }
});

export default groupSlice;

export function loadGroups() {
  return async (dispatch: AppDispatch) => {
    const groups = await webGet("/groups", {});
    if (groups) dispatch(groupSlice.actions.setGroups(groups));
  };
}

export function pushNewGroup(newGroup: NewGroup) {
  return async (dispatch: AppDispatch) => {
    const group = await webPost("/groups", {}, newGroup);
    if (group) dispatch(groupSlice.actions.addGroup(group));
  };
}

export function pushGroupAddUser(params: { groupId: string; userId: string }) {
  return async (dispatch: AppDispatch) => {
    const group = await webPost(
      "/groups/:id/addUser",
      { id: params.groupId },
      { id: params.userId }
    );
    if (group) dispatch(groupSlice.actions.updateGroup(group));
  };
}

export function pushGroupRemoveUser(params: {
  groupId: string;
  userId: string;
}) {
  return async (dispatch: AppDispatch) => {
    const group = await webPost(
      "/groups/:id/removeUser",
      { id: params.groupId },
      { id: params.userId }
    );
    if (group) dispatch(groupSlice.actions.updateGroup(group));
  };
}
