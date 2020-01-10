import React from "react";
import UserHomePage from "./UserHomePage";
import PublicHomePage from "./PublicHomePage";
import { useSelector } from "react-redux";
import { AppState } from "../../state/appState";
import { useLoad } from "../../api/apiRequest";
import { loadAlphabetListings } from "../alphabets/alphabetSlice";

export default function HomePage() {
  const user = useSelector((state: AppState) => state.currentUser.user);

  useLoad(loadAlphabetListings());

  return user ? <UserHomePage user={user} /> : <PublicHomePage />;
}
