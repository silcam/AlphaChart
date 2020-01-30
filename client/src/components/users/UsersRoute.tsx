import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import NewUserVerify from "./NewUserVerify";
import CurrentUserPage from "./CurrentUserPage";
import NewPasswordForm from "./NewPasswordForm";

export default function UsersRoute() {
  return (
    <Switch>
      <Route
        path="/users/verify/:code"
        render={({ match }) => (
          <NewUserVerify verification={match.params.code} />
        )}
      />
      <Route
        path="/users/passwordReset/:resetKey"
        render={({ match }) => (
          <NewPasswordForm resetKey={match.params.resetKey} />
        )}
      />
      <Route path="/users/me" render={() => <CurrentUserPage />} />
      <Route render={() => <Redirect to="/" />} />
    </Switch>
  );
}
