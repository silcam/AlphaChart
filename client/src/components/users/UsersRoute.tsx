import React from "react";
import { Switch, Route } from "react-router-dom";
import NewUserVerify from "./NewUserVerify";
import { LogInFunc } from "./useCurrentUser";
import { CurrentUser } from "../../models/User";

interface IProps {
  logIn: LogInFunc;
  user: CurrentUser | null;
}

export default function UsersRoute(props: IProps) {
  return (
    <Switch>
      <Route
        path="/users/verify/:code"
        render={({ match }) => (
          <NewUserVerify
            verification={match.params.code}
            logIn={props.logIn}
            user={props.user}
          />
        )}
      />
      <Route render={() => <p>Users Root</p>} />
    </Switch>
  );
}
