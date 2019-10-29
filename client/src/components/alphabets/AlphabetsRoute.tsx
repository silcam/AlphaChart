import React from "react";
import { Switch, Route } from "react-router-dom";
import AlphabetsPage from "./AlphabetsPage";
import NewAlphabetPage from "./NewAlphabetPage";
import { CurrentUserOrNot } from "../../models/User";
import ChartPage from "./ChartPage";

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
          <ChartPage id={match.params.id} user={props.user} />
        )}
      />
      <Route render={() => <AlphabetsPage />} />
    </Switch>
  );
}
