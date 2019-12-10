import React from "react";
import { CurrentUser } from "../../models/User";
import { Link, useHistory } from "react-router-dom";
import LnkBtn from "../common/LnkBtn";
import LocalePicker from "../common/LocalePicker";

import { usePush } from "../../api/apiRequest";
import { pushLogout } from "../../state/currentUserSlice";
import { useTranslation } from "./useTranslation";
import Loading from "./Loading";
import { useSelector } from "react-redux";
import { AppState } from "../../state/appState";

interface IProps {
  user: CurrentUser | null;
}

export default function NavBar(props: IProps) {
  const t = useTranslation();
  const history = useHistory();
  const [logOut] = usePush(pushLogout);
  const loadingCount = useSelector((state: AppState) => state.loading);
  const loading = loadingCount > 0;

  return (
    <div className="compNavBar flex-row" style={{ padding: "8px 0" }}>
      <div className="flex-row">
        <Link to="/">{t("Home")}</Link>
        {loading && <Loading small />}
      </div>
      <div className="flex-row">
        <LocalePicker />
        {props.user && (
          <ul className="list-row">
            <li>
              <b>{props.user.name}</b>
            </li>
            <li>
              <LnkBtn
                onClick={() => logOut(null).then(() => history.push("/"))}
                text={t("Log_out")}
              />
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
