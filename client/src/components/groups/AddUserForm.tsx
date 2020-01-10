import React, { useState } from "react";
import { Group } from "../../models/Group";
import { useTranslation } from "../common/useTranslation";
import { usePush } from "../../api/apiRequest";
import { pushGroupAddUser } from "./groupSlice";
import { User } from "../../models/User";
import UserSearchInput from "../users/UserSearchInput";

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
    <div className="flex-row-left">
      <label>{t("Add_user")}:</label>
      <UserSearchInput
        updateValue={setSelectedUser}
        filter={user => !props.group.users.includes(user.id)}
      />
      <button className="mini" onClick={save} disabled={!selectedUser}>
        {t("Save")}
      </button>
    </div>
  );
}
