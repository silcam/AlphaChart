import React, { useState } from "react";
import { CreateAccountFunc } from "./useCurrentUser";
import { NewUser, validationErrors } from "../../models/User";
import { useTranslation } from "../common/I18nContext";
import { TKey } from "../../locales/en";

interface IProps {
  createAccount: CreateAccountFunc;
}

export default function CreateAccountForm(props: IProps) {
  const t = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errors, setErrors] = useState<TKey[]>([]);

  const createAccount = () => {
    const newUser: NewUser = {
      email,
      password,
      name: displayName
    };
    const errors = validationErrors(newUser, passwordCheck);
    if (!errors) props.createAccount(newUser, error => setErrors([error]));
    else setErrors(errors);
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        createAccount();
      }}
    >
      <h2>{t("Create_new_account")}</h2>
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
      <p>
        <input
          type="password"
          value={passwordCheck}
          onChange={e => setPasswordCheck(e.target.value)}
          placeholder={t("Verify_password")}
        />
      </p>
      <p>
        <input
          type="text"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          placeholder={t("Display_name")}
        />
      </p>
      <p className="error">
        {errors.map(err => (
          <span style={{ display: "block" }} key={err}>
            {t(err)}
          </span>
        ))}
      </p>
      <button type="submit">{t("Create_the_account")}</button>
    </form>
  );
}
