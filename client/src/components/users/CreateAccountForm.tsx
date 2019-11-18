import React, { useState } from "react";
import { NewUser, validationErrors } from "../../models/User";
import { useTranslation } from "../common/I18nContext";

import useNetwork from "../common/useNetwork";
import { apiPath } from "../../models/Api";
import LnkBtn from "../common/LnkBtn";
import { TKey } from "../../i18n/en";
import Loading from "../common/Loading";

interface IProps {
  cancel: () => void;
  accountCreated: (email: string) => void;
}

export default function CreateAccountForm(props: IProps) {
  const t = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errors, setErrors] = useState<TKey[]>([]);
  const [loading, request] = useNetwork({
    throwErrorsWithResponse: true
  });

  const createAccount = async () => {
    const newUser: NewUser = {
      email,
      password,
      name: displayName
    };
    const errors = validationErrors(newUser, passwordCheck);
    if (errors) {
      setErrors(errors);
    } else {
      try {
        const response = await request(axios =>
          axios.post(apiPath("/users"), newUser)
        );
        if (response) props.accountCreated(email);
      } catch (err) {
        if (err.response && err.response.status === 422)
          setErrors([err.response.data.error]);
        else setErrors(["Unknown_error"]);
      }
    }
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        createAccount();
      }}
    >
      <h2>{t("Create_new_account")}</h2>
      {loading ? (
        <Loading />
      ) : (
        <React.Fragment>
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
          <p>
            <LnkBtn text={t("Cancel")} onClick={props.cancel} />
          </p>
        </React.Fragment>
      )}
    </form>
  );
}
