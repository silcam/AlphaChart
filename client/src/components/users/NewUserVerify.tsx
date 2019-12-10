import React, { useEffect, useState } from "react";
import { useTranslation } from "../common/useTranslation";
import Loading from "../common/Loading";
import LoginForm from "./LoginForm";
import { CurrentUser } from "../../models/User";
import { Redirect } from "react-router-dom";
import { TKey, isTKey } from "../../i18n/en";
import { useSelector } from "react-redux";
import { AppState } from "../../state/appState";
import { usePush } from "../../api/apiRequest";
import { pushVerifyUser } from "../../state/currentUserSlice";

interface IProps {
  verification: string;
}

export default function NewUserVerify(props: IProps) {
  const t = useTranslation();
  const { user } = useSelector((state: AppState) => state.currentUser);
  const [verifiedUser, setVerifiedUser] = useState<CurrentUser | null>(null);
  const [errorMsg, setErrorMsg] = useState<TKey>("");

  const [verify, loading] = usePush(pushVerifyUser, appError => {
    if (
      appError.type == "HTTP" &&
      appError.status == 422 &&
      isTKey(appError.error)
    ) {
      setErrorMsg(appError.error);
      return true;
    }
    return false;
  });

  useEffect(() => {
    verify(props.verification).then(vUser => setVerifiedUser(vUser || null));
  }, []);

  if (user) return <Redirect to="/" />;

  return verifiedUser ? (
    <div>
      <h3>{t("Account_verified")}</h3>
      <LoginForm email={verifiedUser.email} />
    </div>
  ) : (
    <div>
      <h2>{t("Verifying")}</h2>
      {loading && <Loading />}
      <p className="error">{t(errorMsg)}</p>
    </div>
  );
}
