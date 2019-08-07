import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import LetterEntry from "./LetterEntry";
import { AlphabetChart } from "../alphabet/Alphabet";
import ChartEditor from "./ChartEditor";
import Axios from "axios";
import HomePage from "./HomePage";
import NewAlphabetChart from "./NewAlphabetChart";

export default function AlphaChart() {
  return (
    <div>
      <Switch>
        <Route
          path="/alphabets/new"
          render={({ history }) => <NewAlphabetChart history={history} />}
        />
        <Route render={() => <HomePage />} />
      </Switch>
    </div>
  );
}
