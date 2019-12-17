import React, { useState } from "react";
import { User, CurrentUser } from "../../models/User";
import { Group } from "../../models/Group";
import { useTranslation } from "../common/useTranslation";
import Select from "../common/Select";
import { usePush } from "../../api/apiRequest";
import { pushGroupRemoveUser } from "./groupSlice";

interface IProps {
  group: Group;
  groupUsers: User[];
  user: CurrentUser;
  done: () => void;
}

export default function RemoveUserForm(props: IProps) {
  const t = useTranslation();
  const users = props.groupUsers.filter(u => u.id !== props.user.id);
  const [selectedId, setSelectedId] = useState(users[0] ? users[0].id : "");
  const [removeUser] = usePush(pushGroupRemoveUser);
  const clickSave = () => {
    removeUser({ groupId: props.group.id, userId: selectedId });
    props.done();
  };

  return (
    <div className="space-kids">
      <label>{t("Remove")}</label>
      <Select
        value={selectedId}
        options={users.map(u => [u.id, u.name])}
        setValue={id => setSelectedId(id)}
      />
      <div className="flex-row-left">
        <button
          className="mini"
          onClick={clickSave}
          disabled={selectedId == ""}
        >
          {t("Save")}
        </button>
        <button className="mini red" onClick={props.done}>
          {t("Cancel")}
        </button>
      </div>
    </div>
  );
}
