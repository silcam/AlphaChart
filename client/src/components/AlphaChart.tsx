import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import HomePage from "./main/HomePage";
import AlphabetsRoute from "./alphabets/AlphabetsRoute";
import UsersRoute from "./users/UsersRoute";
import useCurrentUser from "./users/useCurrentUser";
import NavBar from "./common/NavBar";
import ErrorContext, { ACError } from "./common/ErrorContext";
import ErrorMessage from "./common/ErrorMessage";
import I18nContext from "./common/I18nContext";
import { Locale } from "../i18n/i18n";

export default function AlphaChart() {
  const [error, setError] = useState<ACError | null>(null);
  const [locale, setLocale] = useState<Locale>("en");

  return (
    <div id="page-root">
      <ErrorContext.Provider value={{ error, setError }}>
        <I18nContext.Provider value={{ locale, setLocale }}>
          <AlphaChartInner />
        </I18nContext.Provider>
      </ErrorContext.Provider>
    </div>
  );
}

function AlphaChartInner() {
  const [currentUser, logIn, logOut] = useCurrentUser();
  return (
    <React.Fragment>
      <NavBar user={currentUser} logOut={logOut} />
      <ErrorMessage />
      <Switch>
        <Route
          path="/alphabets"
          render={() => <AlphabetsRoute user={currentUser} />}
        />
        <Route
          path="/users"
          render={() => <UsersRoute user={currentUser} logIn={logIn} />}
        />
        <Route
          render={() => (
            <HomePage currentUser={currentUser} logIn={logIn} logOut={logOut} />
          )}
        />
      </Switch>
    </React.Fragment>
  );
}
