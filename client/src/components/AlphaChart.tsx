import React from "react";
import { Switch, Route } from "react-router-dom";
import HomePage from "./main/HomePage";
import AlphabetsRoute from "./alphabets/AlphabetsRoute";
import UsersRoute from "./users/UsersRoute";
import NavBar from "./common/NavBar";
import { useSelector } from "react-redux";
import { AppState } from "../state/appState";
import { useLoad } from "../api/apiRequest";
import { loadCurrentUser } from "../state/currentUserSlice";
import AppBanners from "./common/AppBanners";
import GroupsRoute from "./groups/GroupsRoute";

export default function AlphaChart() {
  const { user, loaded } = useSelector((state: AppState) => state.currentUser);
  useLoad(loadCurrentUser());

  return (
    <div id="page-root">
      <NavBar user={user} />
      <AppBanners />
      {loaded && (
        <Switch>
          <Route path="/alphabets" render={() => <AlphabetsRoute />} />
          <Route path="/users" render={() => <UsersRoute />} />
          <Route path="/groups" render={() => <GroupsRoute />} />
          <Route render={() => <HomePage />} />
        </Switch>
      )}
    </div>
  );
}
