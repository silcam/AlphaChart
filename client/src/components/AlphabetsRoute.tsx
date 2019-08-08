import React from "react";
import { Switch, Route } from "react-router-dom";
import AlphabetsPage from "./AlphabetsPage";
import NewAlphabetPage from "./NewAlphabetPage";
import ViewChartPage from "./ViewChartPage";
import EditChartPage from "./EditChartPage";

export default function AlphabetsRoute() {
  return (
    <Switch>
      <Route
        path="/alphabets/new"
        render={({ history }) => <NewAlphabetPage history={history} />}
      />
      <Route
        path="/alphabets/view/:id"
        render={({ match }) => <ViewChartPage id={match.params.id} />}
      />
      <Route
        path="/alphabets/edit/:id/chart"
        render={({ match, history }) => (
          <EditChartPage id={match.params.id} history={history} />
        )}
      />
      <Route
        path="/alphabets/edit/:id"
        render={() => <p>Edit alphabet name here</p>}
      />
      <Route render={() => <AlphabetsPage />} />
    </Switch>
  );
}
