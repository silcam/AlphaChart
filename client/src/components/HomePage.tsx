import React from "react";
import { CurrentUser } from "../alphabet/User";
import UserHomePage from "./UserHomePage";
import PublicHomePage from "./PublicHomePage";
import { LogInFunc, LogOutFunc } from "./useCurrentUser";

interface IProps {
  currentUser: CurrentUser | null;
  logIn: LogInFunc;
  logOut: LogOutFunc;
}

export default function HomePage(props: IProps) {
  return props.currentUser ? (
    <UserHomePage logOut={props.logOut} />
  ) : (
    <PublicHomePage logIn={props.logIn} />
  );
}
