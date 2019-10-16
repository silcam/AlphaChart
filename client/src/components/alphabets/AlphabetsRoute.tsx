import React from "react";
import { Switch, Route } from "react-router-dom";
import AlphabetsPage from "./AlphabetsPage";
import NewAlphabetPage from "./NewAlphabetPage";
import ViewChartPage from "./ViewChartPage";
import EditChartPage from "./EditChartPage";
import { CurrentUserOrNot } from "../../models/User";

interface IProps {
  user: CurrentUserOrNot;
}

export default function AlphabetsRoute(props: IProps) {
  return (
    <Switch>
      <Route
        path="/alphabets/new"
        render={({ history }) => <NewAlphabetPage history={history} />}
      />
      <Route
        path="/alphabets/view/:id"
        render={({ match }) => (
          <ViewChartPage id={match.params.id} user={props.user} />
        )}
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
