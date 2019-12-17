import React, { useState } from "react";
import { useLoad } from "../../api/apiRequest";
import { loadGroups } from "./groupSlice";
import { loadAlphabetListings } from "../alphabets/alphabetSlice";
import { useSelector } from "react-redux";
import { AppState } from "../../state/appState";
import { Switch, Route } from "react-router";
import GroupsIndex from "./GroupsIndex";
import { loadUsers } from "../../state/userSlice";

export default function GroupsRoute() {
  useLoad(loadGroups());
  useLoad(loadAlphabetListings());
  useLoad(loadUsers());

  return (
    <Switch>
      <Route path="/groups/new" render={() => null} />
      <Route
        path="/groups/:id"
        render={({ match }) => <GroupsIndex id={match.params.id} />}
      />
      <Route render={() => <GroupsIndex />} />
    </Switch>
  );
}
