import React from "react";
import { ChartDimens } from "./ViewChartPage";
import CopyAlphabetButton from "./CopyAlphabetButton";
import { useTranslation } from "../common/useTranslation";
import { AlphabetInflated, isOwner } from "../../models/Alphabet";
import useMyGroups from "../groups/useMyGroups";
import { useAppSelector } from "../../state/appState";
import GuestUsersMenu from "./GuestUsersMenu";
import useCanEdit from "./useCanEdit";

interface IProps {
  alphabet: AlphabetInflated;
  setChartDimens: (d: ChartDimens | null) => void;
  setEditing: () => void;
  setExporting: () => void;
}

export default function ViewChartHeader(props: IProps) {
  const t = useTranslation();
  const user = useAppSelector(state => state.currentUser.user);
  const myGroups = useMyGroups();

  const canEdit = useCanEdit()(props.alphabet);
  const canShare =
    (user && isOwner(props.alphabet, user)) ||
    myGroups.some(g => isOwner(props.alphabet, g));

  return (
    <div
      className="flex-row"
      style={{
        margin: "20px 0"
      }}
    >
      <div className="flex-row">
        <h3>
          <label>
            {props.alphabet.ownerObj
              ? t("By_name", { name: props.alphabet.ownerObj.name })
              : ""}
          </label>
        </h3>
      </div>
      <div className="flex-row">
        {canEdit && (
          <button onClick={props.setEditing}>{t("Edit_chart")}</button>
        )}
        <CopyAlphabetButton
          alphabet={props.alphabet}
          user={user}
          myGroups={myGroups}
        />
        {canShare && <GuestUsersMenu alphabet={props.alphabet} />}
        <button onClick={props.setExporting}>{t("Export_chart")}</button>
      </div>
    </div>
  );
}
