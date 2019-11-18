import React, { useEffect, useState } from "react";
import { useTranslation } from "../common/I18nContext";
import useNetwork from "../common/useNetwork";
import { apiPath } from "../../models/Api";
import Loading from "../common/Loading";
import LoginForm from "./LoginForm";
import { LogInFunc } from "./useCurrentUser";
import { CurrentUser } from "../../models/User";
import { Redirect } from "react-router-dom";
import { TKey } from "../../i18n/en";

interface IProps {
  verification: string;
  logIn: LogInFunc;
  user: CurrentUser | null;
}

export default function NewUserVerify(props: IProps) {
  const t = useTranslation();
  const [loading, request] = useNetwork({ throwErrorsWithResponse: true });
  const [verifiedUser, setVerifiedUser] = useState<CurrentUser | null>(null);
  const [errorMsg, setErrorMsg] = useState<TKey>("");

  useEffect(() => {
    request(axios =>
      axios.post(apiPath("/users/verify"), { verification: props.verification })
    )
      .then(response => response && setVerifiedUser(response.data))
      .catch(err =>
        err.response.data.error
          ? setErrorMsg(err.response.data.error)
          : setErrorMsg("Unknown_error")
      );
  }, []);

  if (props.user) return <Redirect to="/" />;

  return verifiedUser ? (
    <div>
      <h3>{t("Account_verified")}</h3>
      <LoginForm logIn={props.logIn} email={verifiedUser.email} />
    </div>
  ) : (
    <div>
      <h2>{t("Verifying")}</h2>
      {loading && <Loading />}
      <p className="error">{t(errorMsg)}</p>
    </div>
  );
}
