import React, { useState } from "react";
import { Group } from "../../models/Group";
import { useTranslation } from "../common/useTranslation";
import SearchTextInput from "../common/SearchTextInput";
import { webGet, usePush } from "../../api/apiRequest";
import { pushGroupAddUser } from "./groupSlice";
import { User } from "../../models/User";

interface IProps {
  group: Group;
  done: () => void;
}

export default function AddUserForm(props: IProps) {
  const t = useTranslation();
  const [addUser] = usePush(pushGroupAddUser);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const save = () => {
    if (selectedUser) {
      addUser({ groupId: props.group.id, userId: selectedUser.id });
    }
    props.done();
  };

  return (
    <div className="space-kids">
      <label>{t("Add_user")}:</label>
      <SearchTextInput
        sendQuery={q =>
          webGet("/users/search", {}, { q }).then(users =>
            users ? users.filter(u => !props.group.users.includes(u.id)) : users
          )
        }
        updateValue={(u: User | null) => setSelectedUser(u)}
        itemId={u => u.id}
        itemDisplay={u => u.name}
        allowBlank
        placeholder={t("Name_or_email")}
      />
      <div className="flex-row-left">
        <button className="mini" onClick={save} disabled={!selectedUser}>
          {t("Save")}
        </button>
        <button className="mini red" onClick={props.done}>
          {t("Cancel")}
        </button>
      </div>
    </div>
  );
}