import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import NewAlphabetPage from "./NewAlphabetPage";
import ChartPage from "./ChartPage";
import AlphabetsBrowserPage from "./AlphabetsBrowserPage";

export default function AlphabetsRoute() {
  return (
    <Switch>
      <Route
        path="/alphabets/new"
        render={({ history, location }) => (
          <NewAlphabetPage history={history} location={location} />
        )}
      />
      <Route
        path="/alphabets/view/:id"
        render={({ match }) => (
          <ChartPage key={match.params.id} id={match.params.id} />
        )}
      />
      <Route render={() => <AlphabetsBrowserPage />} />
    </Switch>
  );
}
