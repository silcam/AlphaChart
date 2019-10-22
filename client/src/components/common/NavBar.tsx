import React, { useContext } from "react";
import { CurrentUser } from "../../models/User";
import { Link, useHistory } from "react-router-dom";
import { LogOutFunc } from "../users/useCurrentUser";
import LnkBtn from "../common/LnkBtn";
import ErrorContext from "./ErrorContext";

interface IProps {
  user: CurrentUser | null;
  logOut: LogOutFunc;
}

export default function NavBar(props: IProps) {
  const history = useHistory();
  const { setErrorMessage } = useContext(ErrorContext);
  return (
    <div className="flex-row" style={{ padding: "8px 0" }}>
      <Link to="/">Home</Link>
      {props.user && (
        <ul className="list-row">
          <li>{props.user.name}</li>
          <li>
            <LnkBtn
              onClick={() =>
                props
                  .logOut(() => setErrorMessage("Error logging out."))
                  .then(() => history.push("/"))
              }
              text="Log out"
            />
          </li>
        </ul>
      )}
    </div>
  );
}
