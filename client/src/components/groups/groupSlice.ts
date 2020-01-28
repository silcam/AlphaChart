import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Group, groupCompare, NewGroup } from "../../models/Group";
import { AppDispatch } from "../../state/appState";
import { webGet, webPost } from "../../api/apiRequest";
import { LoadAction, loadAction } from "../../state/LoadAction";
import { modelListMerge } from "../../util/arrayUtils";

const groupSlice = createSlice({
  name: "groups",
  initialState: [] as Group[],
  reducers: {
    addGroup: (state, action: PayloadAction<Group>) =>
      [...state, action.payload].sort(groupCompare)
  },
  extraReducers: {
    ACLoad: (state, action: LoadAction) =>
      modelListMerge(state, action.payload.groups, groupCompare)
  }
});

export default groupSlice;

export function loadGroups() {
  return async (dispatch: AppDispatch) => {
    const payload = await webGet("/groups", {});
    if (payload) dispatch(loadAction(payload));
  };
}

export function pushNewGroup(newGroup: NewGroup) {
  return async (dispatch: AppDispatch) => {
    const group = await webPost("/groups", {}, newGroup);
    if (group) dispatch(groupSlice.actions.addGroup(group));
    return group;
  };
}

export function pushGroupAddUser(params: { groupId: string; userId: string }) {
  return async (dispatch: AppDispatch) => {
    const payload = await webPost(
      "/groups/:id/addUser",
      { id: params.groupId },
      { id: params.userId }
    );
    if (payload) dispatch(loadAction(payload));
  };
}

export function pushGroupRemoveUser(params: {
  groupId: string;
  userId: string;
}) {
  return async (dispatch: AppDispatch) => {
    const payload = await webPost(
      "/groups/:id/removeUser",
      { id: params.groupId },
      { id: params.userId }
    );
    if (payload) dispatch(loadAction(payload));
  };
}

export function pushGroupUpdate(params: { id: string; name: string }) {
  const { id, name } = params;
  return async (dispatch: AppDispatch) => {
    const payload = await webPost("/groups/:id/update", { id }, { name });
    if (payload) dispatch(loadAction(payload));
    return payload;
  };
}
