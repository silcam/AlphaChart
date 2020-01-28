import React, { useState } from "react";
import { GroupInflated } from "../../models/Group";
import { useTranslation } from "../common/useTranslation";
import { Link } from "react-router-dom";
import { CurrentUser } from "../../models/User";
import EditingUserList from "./EditingUserList";
import LnkBtn from "../common/LnkBtn";
import ChangeGroupNameForm from "./ChangeGroupNameForm";

interface IProps {
  group: GroupInflated;
  user?: CurrentUser;
}

type GroupViewState = "normal" | "manageUsers" | "changeName";

export default function GroupView(props: IProps) {
  const t = useTranslation();
  const group = props.group;
  const [viewState, setViewState] = useState<GroupViewState>("normal");
  const toggleManageUsers = () =>
    setViewState(viewState == "manageUsers" ? "normal" : "manageUsers");
  const toggleChangeName = () =>
    setViewState(viewState == "changeName" ? "normal" : "changeName");

  return (
    <div>
      <h1 className="std-h">{props.group.name}</h1>

      {props.user && (
        <div style={{ display: "block", fontSize: "smaller" }}>
          <LnkBtn text={t("Change_name")} onClick={toggleChangeName} />
          {" | "}
          <LnkBtn text={t("Manage_users")} onClick={toggleManageUsers} />
          {" | "}
          <Link
            to={{
              pathname: "/alphabets/new",
              state: { owner: { id: props.group.id, type: "group" } }
            }}
          >
            {t("Add_alphabet")}
          </Link>
        </div>
      )}
      <hr />

      <div className="indent">
        {viewState == "changeName" ? (
          <ChangeGroupNameForm group={props.group} done={toggleChangeName} />
        ) : (
          <React.Fragment>
            {viewState == "normal" && (
              <React.Fragment>
                <h3 className="std-h" style={{ marginTop: ".2em" }}>
                  {t("Alphabet_charts")}
                </h3>
                <ul className="std indent">
                  {group.alphabetObjs.map(alphabet => (
                    <li key={alphabet.id}>
                      <Link to={`/alphabets/view/${alphabet.id}`}>
                        {alphabet.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </React.Fragment>
            )}

            {props.user && (
              <React.Fragment>
                <h3 className="std-h">{t("Users")}</h3>

                <div className="indent">
                  {viewState == "manageUsers" ? (
                    <EditingUserList
                      group={props.group}
                      user={props.user}
                      done={toggleManageUsers}
                    />
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
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
