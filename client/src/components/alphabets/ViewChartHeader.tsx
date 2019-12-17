import React from "react";
import ChartToImage from "./ChartToImage";
import { ChartDimens } from "./ViewChartPage";
import CopyAlphabetButton from "./CopyAlphabetButton";
import { useTranslation } from "../common/useTranslation";
import { Group } from "../../models/Group";
import { User } from "../../models/User";
import { Alphabet } from "../../models/Alphabet";

interface IProps {
  alphabet: Alphabet;
  setChartDimens: (d: ChartDimens | null) => void;
  canEdit: boolean;
  loggedIn: boolean;
  setEditing: (e: boolean) => void;
  owner?: Group | User;
}

export default function ViewChartHeader(props: IProps) {
  const t = useTranslation();
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
            {props.owner ? t("By_name", { name: props.owner.name }) : ""}
          </label>
        </h3>
      </div>
      <div className="flex-row">
        <div>
          {props.canEdit ? (
            <button onClick={() => props.setEditing(true)}>
              {t("Edit_chart")}
            </button>
          ) : props.loggedIn ? (
            <CopyAlphabetButton id={props.alphabet.id} />
          ) : null}
        </div>
        <ChartToImage setChartDimens={props.setChartDimens} />
      </div>
    </div>
  );
}
