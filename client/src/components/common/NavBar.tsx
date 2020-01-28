import React from "react";
import { CurrentUser } from "../../models/User";
import { Link, useHistory } from "react-router-dom";
import LnkBtn from "../common/LnkBtn";
import LocalePicker from "../common/LocalePicker";

import { usePush } from "../../api/apiRequest";
import { pushLogout } from "../../state/currentUserSlice";
import { useTranslation } from "./useTranslation";
import Loading from "./Loading";
import { useAppSelector } from "../../state/appState";
import { OptionButtonSimple } from "./OptionButton";

interface IProps {
  user: CurrentUser | null;
}

export default function NavBar(props: IProps) {
  const t = useTranslation();
  const history = useHistory();
  const [logOut] = usePush(pushLogout);
  const loadingCount = useAppSelector(state => state.loading);
  const loading = loadingCount > 0;
  const fullScreen = useAppSelector(state => state.page.fullScreen);

  if (fullScreen) return null;

  return (
    <div className="compNavBar flex-row" style={{ padding: "8px 0" }}>
      <div className="flex-row linkMenu">
        <Link to="/">{t("Home")}</Link>
        <Link to="/groups">{t("Groups")}</Link>
        {loading && <Loading small />}
      </div>
      <div className="flex-row">
        <LocalePicker />
        {props.user && (
          <OptionButtonSimple
            buttonText={props.user.name}
            lnkBtn
            renderContextMenu={({ hideMenu }) => (
              <table
                className="padded-cells menu"
                style={{ width: "max-content" }}
              >
                <tbody>
                  <tr>
                    <td
                      onMouseDown={() => {
                        history.push("/users/me");
                        hideMenu();
                      }}
                    >
                      {props.user!.name}
                    </td>
                  </tr>
                  <tr>
                    <td
                      onMouseDown={() =>
                        logOut(null).then(() => history.push("/"))
                      }
                    >
                      {t("Log_out")}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          />
        )}
      </div>
    </div>
  );
}
