import React, { useState } from "react";
import { AlphabetInflated } from "../../models/Alphabet";
import { useTranslation } from "../common/useTranslation";
import { usePush } from "../../api/apiRequest";
import { pushUpdateAlphabet } from "./alphabetSlice";

interface IProps {
  alphabet: AlphabetInflated;
  done: () => void;
}

export default function EditAlphabet(props: IProps) {
  const t = useTranslation();

  const [newName, setNewName] = useState("");
  const newNameValid = newName.length > 0;

  const [sendUpdate] = usePush(pushUpdateAlphabet);
  const save = async () => {
    const success = await sendUpdate({ id: props.alphabet.id, name: newName });
    if (success) props.done();
  };

  return (
    <div>
      <h1>{props.alphabet.name}</h1>
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
