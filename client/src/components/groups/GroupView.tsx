import React, { useState } from "react";
import { GroupInflated } from "../../models/Group";
import { useTranslation } from "../common/useTranslation";
import { Link } from "react-router-dom";
import { CurrentUser } from "../../models/User";
import EditingUserList from "./EditingUserList";

interface IProps {
  group: GroupInflated;
  user?: CurrentUser;
}

type UserListState = "users" | "add" | "remove";

export default function GroupView(props: IProps) {
  const t = useTranslation();
  const group = props.group;
  const [managingUsers, setManagingUsers] = useState(false);
  const toggleManagingUsers = () => setManagingUsers(!managingUsers);

  return (
    <div>
      <h1 className="std-h">
        {props.group.name}
        <hr />
      </h1>

      <div className="indent">
        <h3 className="std-h" style={{ marginTop: ".2em" }}>
          {t("Alphabet_charts")}
          {props.user && (
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
          )}
        </h3>
        <ul className="std indent">
          {group.alphabetObjs.map(alphabet => (
            <li key={alphabet.id}>
              <Link to={`/alphabets/view/${alphabet.id}`}>{alphabet.name}</Link>
            </li>
          ))}
        </ul>

        {props.user && (
          <React.Fragment>
            <h3 className="std-h">
              {t("Users")}
              <button
                className="mini"
                style={{ marginLeft: "20px" }}
                onClick={() => toggleManagingUsers()}
              >
                {managingUsers ? t("Done") : t("Manage")}
              </button>
            </h3>

            <div className="indent">
              {managingUsers ? (
                <EditingUserList group={props.group} user={props.user} />
              ) : (
                <ul className="std">
                  {group.userObjs.map(user => (
                    <li key={user.id}>{user.name}</li>
                  ))}
                </ul>
              )}
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
