import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../state/appState";
import GroupList from "./GroupList";
import { Group } from "../../models/Group";
import { useTranslation } from "../common/useTranslation";
import GroupView from "./GroupView";
import MyGroupView from "./MyGroupView";

interface IProps {
  id?: string;
}

export default function GroupsIndex(props: IProps) {
  const t = useTranslation();
  const user = useSelector((state: AppState) => state.currentUser.user);
  const userId = user ? user.id : "";
  const groups = useSelector((state: AppState) => state.groups);
  const myGroups: Group[] = [];
  const otherGroups: Group[] = [];
  groups.forEach(g =>
    g.users.includes(userId) ? myGroups.push(g) : otherGroups.push(g)
  );
  const group = groups.find(g => g.id === props.id);

  return (
    <div className="compGroupsIndex">
      <div>
        {myGroups.length > 0 && (
          <GroupList
            groups={myGroups}
            title={t("My_groups")}
            selectedId={props.id}
          />
        )}
        <GroupList
          groups={otherGroups}
          title={t("Groups")}
          selectedId={props.id}
        />
      </div>
      <div>
        {group &&
          (group.users.includes(userId) ? (
            <MyGroupView group={group} user={user!} />
          ) : (
            <GroupView group={group} />
          ))}
      </div>
    </div>
  );
}
