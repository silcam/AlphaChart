import React from "react";
import { CurrentUser } from "../../models/User";
import { useAppSelector } from "../../state/appState";
import LoginForm from "./LoginForm";

interface IProps {
  children: (user: CurrentUser) => JSX.Element;
}

export default function RequireLogin(props: IProps) {
  const user = useAppSelector(state => state.currentUser.user);

  if (!user) return <LoginForm />;

  return props.children(user);
}
