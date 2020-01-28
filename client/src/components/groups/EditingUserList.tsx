import React from "react";
import { GroupInflated } from "../../models/Group";
import { CurrentUser, User } from "../../models/User";
import AddUserForm from "./AddUserForm";
import { useTranslation } from "../common/useTranslation";
import { usePush } from "../../api/apiRequest";
import { pushGroupRemoveUser } from "./groupSlice";

interface IProps {
  group: GroupInflated;
  user: CurrentUser;
  done: () => void;
}

export default function EditingUserList(props: IProps) {
  const t = useTranslation();
  const [postRemoveUser] = usePush(pushGroupRemoveUser);
  const remove = (user: User) => {
    if (
      window.confirm(
        t("Confirm_remove_user_from_group", {
          userName: user.name,
          groupName: props.group.name
        })
      )
    ) {
      postRemoveUser({ groupId: props.group.id, userId: user.id });
    }
  };

  return (
    <div className="space-kids">
      <ul className="std">
        {props.group.userObjs.map(user => (
          <li key={user.id}>
            {user.name}
            {user.id !== props.user.id && (
              <button className="mini red" onClick={() => remove(user)}>
                {t("Remove")}
              </button>
            )}
          </li>
        ))}
      </ul>
      <AddUserForm group={props.group} done={() => {}} />
      <button onClick={props.done}>{t("Done")}</button>
    </div>
  );
}
