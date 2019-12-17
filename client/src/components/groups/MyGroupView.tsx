import React, { useState } from "react";
import { Group } from "../../models/Group";
import { useTranslation } from "../common/useTranslation";
import { useSelector } from "react-redux";
import { AppState } from "../../state/appState";
import { Link } from "react-router-dom";
import RemoveUserForm from "./RemoveUserForm";
import { CurrentUser } from "../../models/User";
import AddUserForm from "./AddUserForm";

interface IProps {
  group: Group;
  user: CurrentUser;
}

type UserListState = "users" | "add" | "remove";

export default function MyGroupView(props: IProps) {
  const t = useTranslation();
  const alphabets = useSelector((state: AppState) => state.alphabets.listings);
  const users = useSelector((state: AppState) => state.users);
  const groupAlphabets = alphabets.filter(
    a => a.ownerType === "group" && a.owner === props.group.id
  );
  const groupUsers = users.filter(u => props.group.users.includes(u.id));
  const [userListState, setUserListState] = useState<UserListState>("users");

  return (
    <div>
      <h2 className="std-h">{props.group.name}</h2>

      <h3 className="std-h">
        {t("Users")}
        {userListState == "users" && (
          <React.Fragment>
            <button
              className="mini"
              style={{ marginLeft: "20px" }}
              onClick={() => setUserListState("add")}
            >
              {t("Add")}
            </button>
            {groupUsers.length > 1 && (
              <button
                className="mini"
                onClick={() => setUserListState("remove")}
              >
                {t("Remove")}
              </button>
            )}
          </React.Fragment>
        )}
      </h3>
      <div className="indent">
        {userListState == "users" && (
          <ul className="std">
            {groupUsers.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        )}
        {userListState == "add" && (
          <AddUserForm
            group={props.group}
            done={() => setUserListState("users")}
          />
        )}
        {userListState == "remove" && (
          <RemoveUserForm
            group={props.group}
            groupUsers={groupUsers}
            user={props.user}
            done={() => setUserListState("users")}
          />
        )}
      </div>
      <h3 className="std-h">
        {t("Alphabet_charts")}
        <Link
          to={{
            pathname: "/alphabets/new",
            state: { owner: { id: props.group.id, type: "group" } }
          }}
        >
          <button className="mini" style={{ marginLeft: "20px" }}>
            {t("Add")}
          </button>
        </Link>
      </h3>
      <ul className="std indent">
        {groupAlphabets.map(alphabet => (
          <li key={alphabet.id}>
            <Link to={`/alphabets/view/${alphabet.id}`}>{alphabet.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
