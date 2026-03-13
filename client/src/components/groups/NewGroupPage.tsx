import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../state/appState";
import { useTranslation } from "../common/useTranslation";
import { enterHandler } from "../common/KeyHandler";
import { usePush } from "../../api/apiRequest";
import { pushNewGroup } from "./groupSlice";
import { Navigate, useNavigate } from "react-router-dom";

export default function NewGroupPage() {
  const t = useTranslation();
  const history = useNavigate();
  const user = useSelector((state: AppState) => state.currentUser.user);

  // we shouldn't be here if we're not logged in.
  if (!user) return <Navigate to="/" replace />
  
  const [name, setName] = useState("");
  const valid = name.length > 0;
  const [saveGroup] = usePush(pushNewGroup);

  const save = () => {
    if (valid) {
      saveGroup({ name }).then(group => {
        if (group) history(`/groups/${group.id}`);
      });
    }
  };

  return (
    <div onKeyDown={enterHandler(save)}>
      <h1>{t("New_group")}</h1>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder={t("Name")}
      />
      <button onClick={save} disabled={!valid}>
        {t("Save")}
      </button>
    </div>
  );
}
