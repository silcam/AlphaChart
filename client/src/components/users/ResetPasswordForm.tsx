import React, { useState } from "react";
import { useTranslation } from "../common/useTranslation";
import { AppErrorHandler } from "../../AppError/AppError";
import { APIError } from "../../api/Api";
import { usePush, webPost } from "../../api/apiRequest";

interface IProps {
  email?: string;
  cancel: () => void;
}

export default function ResetPasswordForm(props: IProps) {
  const t = useTranslation();
  const [email, setEmail] = useState(props.email || "");
  const emailInvalid = email.length == 0;
  const [noSuchEmail, setNoSuchEmail] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleError: AppErrorHandler = error => {
    if (error.type == "HTTP" && error.errorCode == APIError.NoSuchEmail) {
      setNoSuchEmail(true);
      return true;
    }
    return false;
  };
  const sendReset = usePush(
    (email: string) => async () => {
      const success = await webPost("/users/resetPassword", {}, { email });
      if (success) {
        setSubmitted(true);
      }
    },
    handleError
  )[0];

  if (submitted)
    return (
      <div>
        <h2>{t("Password_reset")}</h2>
        <p>{t("Password_reset_check_email", { email })}</p>
      </div>
    );

  return (
    <div>
      <h2>{t("Password_reset")}</h2>
      <input
        type="text"
        placeholder={t("Email")}
        value={email}
        onChange={e => {
          setEmail(e.target.value);
          setNoSuchEmail(false);
        }}
      />
      {noSuchEmail && <p className="error">{t("No_such_email")}</p>}
      <div className="flex-row-left">
        <button disabled={emailInvalid} onClick={() => sendReset(email)}>
          {t("Submit")}
        </button>
        <button className="red" onClick={props.cancel}>
          {t("Cancel")}
        </button>
      </div>
    </div>
  );
}
