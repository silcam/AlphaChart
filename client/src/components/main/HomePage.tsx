import React from "react";
import { CurrentUser } from "../../models/User";
import UserHomePage from "./UserHomePage";
import PublicHomePage from "./PublicHomePage";
import {
  LogInFunc,
  LogOutFunc,
  CreateAccountFunc
} from "../users/useCurrentUser";

interface IProps {
  currentUser: CurrentUser | null;
  logIn: LogInFunc;
  logOut: LogOutFunc;
  createAccount: CreateAccountFunc;
}

export default function HomePage(props: IProps) {
  return props.currentUser ? (
    <UserHomePage logOut={props.logOut} currentUser={props.currentUser} />
  ) : (
    <PublicHomePage logIn={props.logIn} createAccount={props.createAccount} />
  );
}
