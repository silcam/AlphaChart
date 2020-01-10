import React, { useState } from "react";
import { AlphabetInflated } from "../../models/Alphabet";
import { OptionButtonSimple } from "../common/OptionButton";
import { useTranslation } from "../common/useTranslation";
import UserSearchInput from "../users/UserSearchInput";
import { useAppSelector } from "../../state/appState";
import { User } from "../../models/User";
import { usePush } from "../../api/apiRequest";
import { pushShareAlphabet, pushUnshareAlphabet } from "./alphabetSlice";
import { useDispatch } from "react-redux";
import RedX from "../common/RedX";
import LnkBtn from "../common/LnkBtn";

interface IProps {
  alphabet: AlphabetInflated;
}

export default function GuestUsersMenu(props: IProps) {
  const t = useTranslation();
  const dispatch = useDispatch();
  const alphabet = props.alphabet;
  const groups = useAppSelector(state => state.groups);
  const ownerGroup = groups.find(g => g.id === alphabet.owner);
  const exisingEditorIds = alphabet.users.concat(
    alphabet.ownerType === "user"
      ? [alphabet.owner]
      : ownerGroup
      ? ownerGroup.users
      : []
  );

  const [userToAdd, setUserToAdd] = useState<User | null>(null);
  const [postAddUser] = usePush(pushShareAlphabet);
  const [postRemoveUser] = usePush(pushUnshareAlphabet);
  const addUser = async () => {
    if (!!userToAdd) {
      const success = await postAddUser({
        id: alphabet.id,
        userId: userToAdd.id
      });
      if (success) setUserToAdd(null);
    }
  };

  return (
    <OptionButtonSimple
      buttonText={t("Guest_users")}
      renderContextMenu={({ hideMenu }) => (
        <div className="space-kids" style={{ padding: "8px" }}>
          <div style={{ alignSelf: "flex-end" }}>
            <LnkBtn onClick={hideMenu} text={t("Close")} />
          </div>
          <p>{t("Share_explanation")}</p>
          <ul className="indent">
            {alphabet.userObjs.map(user => (
              <li key={user.id}>
                {user.name}{" "}
                <RedX
                  onClick={() =>
                    postRemoveUser({ id: alphabet.id, userId: user.id })
                  }
                />
              </li>
            ))}
          </ul>
          <UserSearchInput
            updateValue={setUserToAdd}
            filter={user => !exisingEditorIds.includes(user.id)}
          />
          <button className="mini" disabled={!userToAdd} onClick={addUser}>
            {t("Save")}
          </button>
        </div>
      )}
    />
  );
}
