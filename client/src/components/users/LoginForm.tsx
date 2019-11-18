import React, { useState } from "react";
import { LoginAttempt } from "../../models/User";
import { LogInFunc } from "./useCurrentUser";
import { useTranslation } from "../common/I18nContext";
import LnkBtn from "../common/LnkBtn";
import { TKey } from "../../i18n/en";
import Loading from "../common/Loading";

interface IProps {
  logIn: LogInFunc;
  createAccount?: () => void;
  email?: string;
  afterLogIn?: () => void;
}

export default function LoginForm(props: IProps) {
  const t = useTranslation();
  const [email, setEmail] = useState(props.email || "");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleError = (e: TKey) => {
    setErrorMessage(t(e));
  };

  const logIn = async () => {
    const loginAttempt: LoginAttempt = { email, password };
    setLoading(true);
    await props.logIn(loginAttempt, handleError);
    setLoading(false);
  };

  return (
    <div>
      <h2>{t("Log_in")}</h2>
      {loading ? (
        <Loading />
      ) : (
        <div>
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
                onChange={e => {
                  setEmail(e.target.value);
                  setErrorMessage("");
                }}
                placeholder={t("Email")}
                autoFocus={!props.email}
              />
            </p>
            <p>
              <input
                type="password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
                placeholder={t("Password")}
                autoFocus={!!props.email}
              />
            </p>
            <p className="error">{errorMessage}</p>
            <button type="submit">{t("Log_in")}</button>
          </form>
          {props.createAccount && (
            <p>
              <LnkBtn
                text={t("Create_account")}
                onClick={props.createAccount}
              />
            </p>
          )}
        </div>
      )}
    </div>
  );
}
