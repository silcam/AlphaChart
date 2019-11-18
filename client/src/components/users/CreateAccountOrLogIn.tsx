import React, { useState } from "react";
import { LogInFunc } from "./useCurrentUser";
import LoginForm from "./LoginForm";
import CreateAccountForm from "./CreateAccountForm";
import { useTranslation } from "../common/I18nContext";

interface IProps {
  logIn: LogInFunc;
}
type ViewState = "login" | "createAccount" | "emailConfirmation";

export default function CreateAccountOrLogIn(props: IProps) {
  const t = useTranslation();
  const [viewState, setViewState] = useState<ViewState>("login");
  const [email, setEmail] = useState("");

  switch (viewState) {
    case "login":
      return (
        <LoginForm
          logIn={props.logIn}
          createAccount={() => setViewState("createAccount")}
        />
      );
    case "createAccount":
      return (
        <CreateAccountForm
          cancel={() => setViewState("login")}
          accountCreated={email => {
            setEmail(email);
            setViewState("emailConfirmation");
          }}
        />
      );
    case "emailConfirmation":
    default:
      return (
        <div>
          <h2>{t("Account_confirmation")}</h2>
          <p>{t("Confirmation_link_email", { email })}</p>
        </div>
      );
  }
}
