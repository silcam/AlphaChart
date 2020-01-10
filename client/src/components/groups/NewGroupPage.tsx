import React, { useState } from "react";
import { useTranslation } from "../common/useTranslation";
import { enterHandler } from "../common/KeyHandler";
import { usePush } from "../../api/apiRequest";
import { pushNewGroup } from "./groupSlice";
import { useHistory } from "react-router-dom";

export default function NewGroupPage() {
  const t = useTranslation();
  const history = useHistory();
  const [name, setName] = useState("");
  const valid = name.length > 0;
  const [saveGroup] = usePush(pushNewGroup);

  const save = () => {
    if (valid) {
      saveGroup({ name }).then(group => {
        if (group) history.push(`/groups/${group.id}`);
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
