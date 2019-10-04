import React from "react";
import { Switch, Route } from "react-router-dom";
import NewUserPage from "./NewUserPage";

export default function UsersRoute() {
  return (
    <Switch>
      <Route path="/users/new" render={() => <NewUserPage />} />
      <Route render={() => <p>Users Root</p>} />
    </Switch>
  );
}
