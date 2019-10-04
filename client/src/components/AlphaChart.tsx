import React from "react";
import { Switch, Route } from "react-router-dom";
import HomePage from "./main/HomePage";
import AlphabetsRoute from "./alphabets/AlphabetsRoute";
import UsersRoute from "./users/UsersRoute";
import useCurrentUser from "./users/useCurrentUser";

export default function AlphaChart() {
  const [currentUser, logIn, logOut, createAccount] = useCurrentUser();
  return (
    <Switch>
      <Route path="/alphabets" render={() => <AlphabetsRoute />} />
      <Route path="/users" render={() => <UsersRoute />} />
      <Route
        render={() => (
          <HomePage
            currentUser={currentUser}
            logIn={logIn}
            logOut={logOut}
            createAccount={createAccount}
          />
        )}
      />
    </Switch>
  );
}
