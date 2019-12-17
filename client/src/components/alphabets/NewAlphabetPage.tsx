import React, { useState } from "react";
import {
  blankAlphabet,
  DraftAlphabet,
  AlphOwnerType
} from "../../models/Alphabet";
import { History, Location } from "history";
import keyHandler from "../common/KeyHandler";
import { usePush, useLoad } from "../../api/apiRequest";
import { pushDraftAlphabet } from "./alphabetSlice";
import { useSelector } from "react-redux";
import { AppState } from "../../state/appState";
import { useTranslation } from "../common/useTranslation";
import { loadGroups } from "../groups/groupSlice";
import useMyGroups from "../groups/useMyGroups";
import RadioSelect from "../common/RadioSelect";

interface IProps {
  history: History;
  location: Location;
}

interface OwnerOption {
  id: string;
  type: AlphOwnerType;
  name: string;
}

export default function NewAlphabetPage(props: IProps) {
  const t = useTranslation();
  const [name, setName] = useState("");
  const formIsValid = name.length > 0;
  const [saveAlphabet, loading] = usePush(pushDraftAlphabet);
  const user = useSelector((state: AppState) => state.currentUser.user);
  if (!user) throw "Not logged in on new alphabet page!";
  useLoad(loadGroups());
  const userGroups = useMyGroups();
  const ownerOptions: OwnerOption[] = [
    ...userGroups.map(g => ({
      id: g.id,
      type: "group" as AlphOwnerType,
      name: g.name
    })),
    { id: user.id, type: "user", name: user.name }
  ];
  const locationOwner = props.location.state && props.location.state.owner;
  const initialIndex = locationOwner
    ? ownerOptions.findIndex(
        opt => opt.id == locationOwner.id && opt.type == locationOwner.type
      )
    : 0;
  const [selectedOwnerIndex, setSelectedOwnerIndex] = useState(initialIndex);

  const save = async () => {
    if (formIsValid) {
      const owner = ownerOptions[selectedOwnerIndex];
      const draft: DraftAlphabet = {
        ...blankAlphabet(name, owner.id, owner.type)
      };
      const alphabet = await saveAlphabet(draft);
      if (alphabet) {
        const id = alphabet.id;
        props.history.push(`/alphabets/view/${id}`, { edit: true });
      }
    }
  };

  return (
    <div className="space-kids">
      <h2>{t("New_alphabet")}</h2>
      <label>{t("Language")}:</label>
      <div>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyPress={keyHandler({ Enter: save })}
          autoFocus
        />
      </div>
      <label>{t("For_account")}:</label>
      <div className="indent">
        <RadioSelect
          options={ownerOptions.map(opt => opt.name)}
          value={selectedOwnerIndex}
          setValue={setSelectedOwnerIndex}
          inputName="owner"
        />
      </div>

      <button onClick={() => save()} disabled={!formIsValid || loading}>
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
