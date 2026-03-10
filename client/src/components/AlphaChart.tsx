import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./main/HomePage";
import AlphabetsRoute from "./alphabets/AlphabetsRoute";
import UsersRoute from "./users/UsersRoute";
import NavBar from "./common/NavBar";
import { useAppSelector } from "../state/appState";
import { useLoad } from "../api/apiRequest";
import { loadCurrentUser } from "../state/currentUserSlice";
import AppBanners from "./common/AppBanners";
import GroupsRoute from "./groups/GroupsRoute";
import useFullScreen from "./common/useFullScreen";

export default function AlphaChart() {
  const { user, loaded } = useAppSelector(state => state.currentUser);
  useLoad(loadCurrentUser());

  const pageRootStyle = useFullScreen() ? { maxWidth: "100%" } : {};

  return (
    <div id="page-root" style={pageRootStyle}>
      <NavBar user={user} />
      <AppBanners />
      {loaded && (
        <Routes>
          <Route path="/alphabets/*" element={<AlphabetsRoute />} />
          <Route path="/users/*" element={<UsersRoute />} />
          <Route path="/groups/*" element={<GroupsRoute />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      )}
    </div>
  );
}
