import React from "react";
import { Switch, Route } from "react-router-dom";
import HomePage from "./HomePage";
import AlphabetsRoute from "./AlphabetsRoute";
import UsersRoute from "./UsersRoute";

export default function AlphaChart() {
  return (
    <div>
      <Switch>
        <Route path="/alphabets" render={() => <AlphabetsRoute />} />
        <Route path="/users" render={() => <UsersRoute />} />
        <Route render={() => <HomePage />} />
      </Switch>
    </div>
  );
}
