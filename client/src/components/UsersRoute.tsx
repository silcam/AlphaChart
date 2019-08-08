import React from "react";
import { Switch, Route } from "react-router-dom";
import NewUserPage from "./NewUserPage";
import LoginPage from "./LoginPage";

export default function UsersRoute() {
  return (
    <Switch>
      <Route path="/users/new" render={() => <NewUserPage />} />
      <Route path="/users/login" render={() => <LoginPage />} />
      <Route render={() => <p>Users Root</p>} />
    </Switch>
  );
}
