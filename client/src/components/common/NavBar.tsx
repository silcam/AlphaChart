import React from "react";
import { CurrentUser } from "../../models/User";
import { Link } from "react-router-dom";
import { LogOutFunc } from "../users/useCurrentUser";
import LnkBtn from "../common/LnkBtn";

interface IProps {
  user: CurrentUser | null;
  logOut: LogOutFunc;
}

export default function NavBar(props: IProps) {
  return (
    <div className="flex-row" style={{ padding: "8px 0" }}>
      <Link to="/">Home</Link>
      {props.user && (
        <ul className="list-row">
          <li>{props.user.name}</li>
          <li>
            <LnkBtn
              onClick={() => props.logOut(() => console.error("Logout error"))}
              text="Log out"
            />
          </li>
        </ul>
      )}
    </div>
  );
}
