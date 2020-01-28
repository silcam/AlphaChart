import React, { useState } from "react";
import { useTranslation } from "../common/useTranslation";
import { usePush } from "../../api/apiRequest";
import { pushGroupUpdate } from "./groupSlice";
import { Group } from "../../models/Group";

interface IProps {
  group: Group;
  done: () => void;
}

export default function ChangeGroupNameForm(props: IProps) {
  const t = useTranslation();

  const [newName, setNewName] = useState("");
  const newNameValid = newName.length > 0;

  const [sendUpdate] = usePush(pushGroupUpdate);
  const save = async () => {
    const success = await sendUpdate({ id: props.group.id, name: newName });
    if (success) props.done();
  };

  return (
    <div>
      <h3>{t("Change_name")}</h3>
      <input
        type="text"
        placeholder={t("New_name")}
        value={newName}
        onChange={e => setNewName(e.target.value)}
      />
      <div className="flex-row-left">
        <button disabled={!newNameValid} onClick={save}>
          {t("Save")}
        </button>
        <button className="red" onClick={props.done}>
          {t("Cancel")}
        </button>
      </div>
    </div>
  );
}
