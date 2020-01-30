import React, { useState, useEffect } from "react";
import { User, validPassword } from "../../models/User";
import { useTranslation } from "../common/useTranslation";
import Loading from "../common/Loading";
import { webGet, webPost, usePush } from "../../api/apiRequest";
import bannerSlice from "../../banners/bannerSlice";
import { useHistory } from "react-router-dom";
import { TKey } from "../../i18n/en";

interface IProps {
  resetKey: string;
}

export default function NewPasswordForm(props: IProps) {
  const t = useTranslation();
  const history = useHistory();
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [triedSubmit, setTriedSubmit] = useState(false);
  const errors = triedSubmit
    ? passwordErrors(newPassword, confirmNewPassword)
    : [];

  useEffect(() => {
    webGet("/users/passwordReset/:key", { key: props.resetKey })
      .then(user => {
        if (user) setUser(user);
      })
      .finally(() => setLoaded(true));
  }, []);

  const sendChange = usePush(
    (reset: {
      id: string;
      resetKey: string;
      newPassword: string;
    }) => async dispatch => {
      const success = await webPost(
        "/users/:id/changePassword",
        { id: reset.id },
        reset
      );
      if (success) {
        history.push("/");
        dispatch(
          bannerSlice.actions.add({
            type: "Success",
            message: t("Password_changed")
          })
        );
      }
    }
  )[0];
  const save = (user: User) => {
    if (passwordErrors(newPassword, confirmNewPassword).length > 0) {
      setTriedSubmit(true);
    } else {
      sendChange({ id: user.id, newPassword, resetKey: props.resetKey });
    }
  };

  if (!user)
    return (
      <div>
        <h2>{t("Verifying")}</h2>
        {loaded ? (
          <p className="error">{t("Invalid_reset_key")}</p>
        ) : (
          <Loading />
        )}
      </div>
    );
  return (
    <div className="space-kids">
      <h2>{t("Reset_password_for", { name: user.name })}</h2>
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
      {errors.length > 0 && (
        <p className="error">
          {errors.map((tKey, index) => (
            <span key={tKey}>
              {t(tKey)}
              <br />
            </span>
          ))}
        </p>
      )}
      <button
        disabled={!newPassword || !confirmNewPassword || errors.length > 0}
        onClick={() => save(user)}
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
