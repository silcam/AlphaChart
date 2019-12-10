import React from "react";
import { Switch, Route } from "react-router-dom";
import NewUserVerify from "./NewUserVerify";

export default function UsersRoute() {
  return (
    <Switch>
      <Route
        path="/users/verify/:code"
        render={({ match }) => (
          <NewUserVerify verification={match.params.code} />
        )}
      />
      <Route render={() => <p>Users Root</p>} />
    </Switch>
  );
}
