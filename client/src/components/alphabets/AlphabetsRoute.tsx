import React from "react";
import { Switch, Route } from "react-router-dom";
import AlphabetsPage from "./AlphabetsPage";
import NewAlphabetPage from "./NewAlphabetPage";
import ChartPage from "./ChartPage";

export default function AlphabetsRoute() {
  return (
    <Switch>
      <Route
        path="/alphabets/new"
        render={({ history }) => <NewAlphabetPage history={history} />}
      />
      <Route
        path="/alphabets/view/:id"
        render={({ match }) => (
          <ChartPage key={match.params.id} id={match.params.id} />
        )}
      />
      <Route render={() => <AlphabetsPage />} />
    </Switch>
  );
}
