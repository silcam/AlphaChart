import React, { useState } from "react";
import LoginForm from "./LoginForm";
import CreateAccountForm from "./CreateAccountForm";
import { useTranslation } from "../common/useTranslation";

type ViewState = "login" | "createAccount" | "emailConfirmation";

export default function CreateAccountOrLogIn() {
  const t = useTranslation();
  const [viewState, setViewState] = useState<ViewState>("login");
  const [email, setEmail] = useState("");

  switch (viewState) {
    case "login":
      return <LoginForm createAccount={() => setViewState("createAccount")} />;
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
