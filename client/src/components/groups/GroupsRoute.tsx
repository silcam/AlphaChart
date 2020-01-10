import React from "react";
import { useLoad } from "../../api/apiRequest";
import { loadGroups } from "./groupSlice";
import { Switch, Route } from "react-router";
import GroupsIndex from "./GroupsIndex";
import NewGroupPage from "./NewGroupPage";

export default function GroupsRoute() {
  useLoad(loadGroups());

  return (
    <Switch>
      <Route path="/groups/new" render={() => <NewGroupPage />} />
      <Route
        path="/groups/:id"
        render={({ match }) => <GroupsIndex id={match.params.id} />}
      />
      <Route render={() => <GroupsIndex />} />
    </Switch>
  );
}
