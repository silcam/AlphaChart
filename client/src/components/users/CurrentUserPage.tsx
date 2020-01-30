import React, { useState } from "react";
import RequireLogin from "./RequireLogin";
import { useTranslation } from "../common/useTranslation";
import { validEmail } from "../../models/User";
import { useDispatch } from "react-redux";
import { pushUpdateUser } from "../../state/currentUserSlice";
import { usePush } from "../../api/apiRequest";
import bannerSlice from "../../banners/bannerSlice";
import { APIError } from "../../api/Api";
import ChangePasswordForm from "./ChangePasswordForm";

export default function CurrentUserPage() {
  const t = useTranslation();
  const dispatch = useDispatch();

  const [newName, setNewName] = useState("");
  const newNameValid = newName.length > 0;
  const [newEmail, setNewEmail] = useState("");
  const [emailInUse, setEmailInUse] = useState(false);
  const newEmailValid = validEmail(newEmail) && !emailInUse;

  const [sendUpdate] = usePush(pushUpdateUser, error => {
    if (error.type == "HTTP" && error.errorCode == APIError.EmailInUse) {
      setEmailInUse(true);
      return true;
    }
    return false;
  });
  const save = async (data: { id: string; name?: string; email?: string }) => {
    const payload = await sendUpdate(data);
    if (payload)
      dispatch(
        bannerSlice.actions.add({
          type: "Success",
          message: t("Changes_saved")
        })
      );
  };

  return (
    <RequireLogin>
      {user => (
        <div className="space-kids compCurrentUserPage">
          <h1>{user.name}</h1>
          <div>
            <h3>{t("Change_name")}</h3>
            <input
              type="text"
              placeholder={t("New_name")}
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
            <button
              disabled={!newNameValid}
              onClick={() => save({ id: user.id, name: newName })}
            >
              {t("Save")}
            </button>
          </div>
          <div>
            <h3>{t("Change_email")}</h3>
            <input
              type="text"
              placeholder={t("New_email")}
              value={newEmail}
              onChange={e => {
                setNewEmail(e.target.value);
                setEmailInUse(false);
              }}
            />
            {emailInUse && <p className="error">{t("User_exists")}</p>}
            <button
              disabled={!newEmailValid}
              onClick={() => save({ id: user.id, email: newEmail })}
            >
              {t("Save")}
            </button>
          </div>
          <ChangePasswordForm user={user} />
        </div>
      )}
    </RequireLogin>
  );
}
