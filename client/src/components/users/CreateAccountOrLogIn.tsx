import React, { useState } from "react";
import { LogInFunc, CreateAccountFunc } from "./useCurrentUser";
import LoginForm from "./LoginForm";
import CreateAccountForm from "./CreateAccountForm";
import LnkBtn from "../common/LnkBtn";
import { useTranslation } from "../common/I18nContext";

interface IProps {
  logIn: LogInFunc;
  createAccount: CreateAccountFunc;
}

export default function CreateAccountOrLogIn(props: IProps) {
  const t = useTranslation();
  const [showLogin, setShowLogin] = useState(true);
  const toggleShowLogin = () => setShowLogin(!showLogin);
  return (
    <div>
      {showLogin ? (
        <LoginForm logIn={props.logIn} />
      ) : (
        <CreateAccountForm createAccount={props.createAccount} />
      )}
      <p>
        <LnkBtn
          onClick={toggleShowLogin}
          text={showLogin ? t("Create_account") : t("Cancel")}
        />
      </p>
    </div>
  );
}
