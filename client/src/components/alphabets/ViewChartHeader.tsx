import React from "react";
import { ChartDimens } from "./ViewChartPage";
import CopyAlphabetButton from "./CopyAlphabetButton";
import { useTranslation } from "../common/useTranslation";
import { AlphabetInflated, isOwner } from "../../models/Alphabet";
import useMyGroups from "../groups/useMyGroups";
import { useAppSelector } from "../../state/appState";
import GuestUsersMenu from "./GuestUsersMenu";
import useCanEdit from "./useCanEdit";
import { OptionButtonSimple } from "../common/OptionButton";
import ChartMenu from "./ChartMenu";

interface IProps {
  alphabet: AlphabetInflated;
  setChartDimens: (d: ChartDimens | null) => void;
  setEditing: () => void;
  setExporting: () => void;
  editAlphabet: () => void;
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
      style={{
        marginBottom: "20px"
      }}
    >
      <div className="flex-row-left">
        <h2 className="std-h">
          {canEdit ? (
            <OptionButtonSimple
              buttonText={props.alphabet.name}
              renderContextMenu={() => (
                <ChartMenu
                  alphabet={props.alphabet}
                  editAlphabet={props.editAlphabet}
                />
              )}
              lnkBtn
              leftAlignContextMenu
            />
          ) : (
            props.alphabet.name
          )}
        </h2>
      </div>
      <div className="flex-row">
        <div>
          <h3 style={{ marginTop: "0.2em" }}>
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
    </div>
  );
}
