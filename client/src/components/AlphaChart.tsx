import React from "react";
import { Switch, Route } from "react-router-dom";
import HomePage from "./HomePage";
import AlphabetsRoute from "./AlphabetsRoute";
import UsersRoute from "./UsersRoute";
import useCurrentUser from "./useCurrentUser";

export default function AlphaChart() {
  const [currentUser, logIn, logOut] = useCurrentUser();
  return (
    <div>
      <Switch>
        <Route path="/alphabets" render={() => <AlphabetsRoute />} />
        <Route path="/users" render={() => <UsersRoute />} />
        <Route
          render={() => (
            <HomePage currentUser={currentUser} logIn={logIn} logOut={logOut} />
          )}
        />
      </Switch>
    </div>
  );
}
