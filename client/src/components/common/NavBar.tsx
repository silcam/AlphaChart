import React, { useContext } from "react";
import { CurrentUser } from "../../models/User";
import { Link, useHistory } from "react-router-dom";
import { LogOutFunc } from "../users/useCurrentUser";
import LnkBtn from "../common/LnkBtn";
import ErrorContext from "./ErrorContext";
import LocalePicker from "../common/LocalePicker";
import { useTranslation } from "../common/I18nContext";

interface IProps {
  user: CurrentUser | null;
  logOut: LogOutFunc;
}

export default function NavBar(props: IProps) {
  const t = useTranslation();
  const history = useHistory();
  const { setErrorMessage } = useContext(ErrorContext);
  return (
    <div className="flex-row" style={{ padding: "8px 0" }}>
      <Link to="/">{t("Home")}</Link>
      <div className="flex-row">
        <LocalePicker />
        {props.user && (
          <ul className="list-row">
            <li>
              <b>{props.user.name}</b>
            </li>
            <li>
              <LnkBtn
                onClick={() => props.logOut().then(() => history.push("/"))}
                text={t("Log_out")}
              />
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
