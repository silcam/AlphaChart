import React, { useState } from "react";
import { useTranslation } from "../common/useTranslation";
import { validPassword, CurrentUser } from "../../models/User";
import { TKey } from "../../i18n/en";
import { usePush, webPost } from "../../api/apiRequest";
import { useDispatch } from "react-redux";
import bannerSlice from "../../banners/bannerSlice";
import { APIError } from "../../api/Api";
import { AppErrorHandler } from "../../AppError/AppError";

interface IProps {
  user: CurrentUser;
}

export default function ChangePasswordForm(props: IProps) {
  const t = useTranslation();
  const dispatch = useDispatch();
  const [oldPassword, setOldPassword] = useState("");
  const [oldPasswordWrong, setOldPasswordWrong] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [triedSubmit, setTriedSubmit] = useState(false);
  const errors = triedSubmit
    ? passwordErrors(newPassword, confirmNewPassword)
    : [];

  const handleSubmitError: AppErrorHandler = appError => {
    if (appError.type == "HTTP" && appError.errorCode == APIError.BadPassword) {
      setOldPasswordWrong(true);
      return true;
    }
    return false;
  };
  const sendChange = usePush(
    (change: { password: string; newPassword: string }) => async () =>
      await webPost("/users/:id/changePassword", { id: props.user.id }, change),
    handleSubmitError
  )[0];
  const save = async () => {
    if (passwordErrors(newPassword, confirmNewPassword).length > 0) {
      setTriedSubmit(true);
    } else {
      const success = await sendChange({ password: oldPassword, newPassword });
      if (success) {
        dispatch(
          bannerSlice.actions.add({
            type: "Success",
            message: t("Password_changed")
          })
        );
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setTriedSubmit(false);
      }
    }
  };

  return (
    <div className="compChangePasswordForm">
      <h3>{t("Change_password")}</h3>
      <input
        type="password"
        placeholder={t("Current_password")}
        value={oldPassword}
        onChange={e => {
          setOldPassword(e.target.value);
          setOldPasswordWrong(false);
        }}
      />
      <input
        type="password"
        placeholder={t("New_password")}
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder={t("Confirm_new_password")}
        value={confirmNewPassword}
        onChange={e => setConfirmNewPassword(e.target.value)}
      />
      {(errors.length > 0 || oldPasswordWrong) && (
        <p className="error">
          {errors.map((tKey, index) => (
            <span key={tKey}>
              {t(tKey)}
              <br />
            </span>
          ))}
          {oldPasswordWrong && t("Current_password_wrong")}
        </p>
      )}

      <button
        disabled={
          !oldPassword ||
          !newPassword ||
          !confirmNewPassword ||
          errors.length > 0
        }
        onClick={save}
      >
        {t("Save")}
      </button>
    </div>
  );
}

function passwordErrors(newPassword: string, confirmNewPassword: string) {
  const errs: TKey[] = [];
  if (!validPassword(newPassword)) errs.push("Password_too_short");
  if (newPassword !== confirmNewPassword) errs.push("Passwords_do_not_match");
  return errs;
}
