import React, { useState } from "react";
import { LoginAttempt } from "../../models/User";
import { LogInFunc } from "./useCurrentUser";
import { useTranslation } from "../common/I18nContext";

interface IProps {
  logIn: LogInFunc;
}

export default function LoginForm(props: IProps) {
  const t = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleError = (e: "Invalid" | "Unknown") => {
    switch (e) {
      case "Invalid":
        setErrorMessage(t("Invalid_login"));
        break;
      case "Unknown":
        setErrorMessage(t("Unknown_error"));
        break;
    }
  };

  const logIn = async () => {
    const loginAttempt: LoginAttempt = { email, password };
    props.logIn(loginAttempt, handleError);
  };

  return (
    <div>
      <h2>{t("Log_in")}</h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          logIn();
        }}
      >
        <p>
          <input
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t("Email")}
          />
        </p>
        <p>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={t("Password")}
          />
        </p>
        <p className="error">{errorMessage}</p>
        <button type="submit">{t("Log_in")}</button>
      </form>
    </div>
  );
}
