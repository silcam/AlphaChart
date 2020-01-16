import React from "react";
import { Switch, Route } from "react-router-dom";
import HomePage from "./main/HomePage";
import AlphabetsRoute from "./alphabets/AlphabetsRoute";
import UsersRoute from "./users/UsersRoute";
import NavBar from "./common/NavBar";
import { useAppSelector } from "../state/appState";
import { useLoad } from "../api/apiRequest";
import { loadCurrentUser } from "../state/currentUserSlice";
import AppBanners from "./common/AppBanners";
import GroupsRoute from "./groups/GroupsRoute";

export default function AlphaChart() {
  const { user, loaded } = useAppSelector(state => state.currentUser);
  useLoad(loadCurrentUser());
  const fullScreen = useAppSelector(state => state.page.fullScreen);
  const pageRootStyle = fullScreen ? { maxWidth: "100%" } : {};

  return (
    <div id="page-root" style={pageRootStyle}>
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
