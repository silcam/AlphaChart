import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import HomePage from "./main/HomePage";
import AlphabetsRoute from "./alphabets/AlphabetsRoute";
import UsersRoute from "./users/UsersRoute";
import useCurrentUser from "./users/useCurrentUser";
import NavBar from "./common/NavBar";
import ErrorContext from "./common/ErrorContext";
import ErrorMessage from "./common/ErrorMessage";

export default function AlphaChart() {
  const [errorMessage, setErrorMessage] = useState("");
  return (
    <div id="page-root">
      <ErrorContext.Provider value={{ errorMessage, setErrorMessage }}>
        <AlphaChartInner />
      </ErrorContext.Provider>
    </div>
  );
}

function AlphaChartInner() {
  const [currentUser, logIn, logOut, createAccount] = useCurrentUser();
  return (
    <React.Fragment>
      <NavBar user={currentUser} logOut={logOut} />
      <ErrorMessage />
      <Switch>
        <Route
          path="/alphabets"
          render={() => <AlphabetsRoute user={currentUser} />}
        />
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
    </React.Fragment>
  );
}
