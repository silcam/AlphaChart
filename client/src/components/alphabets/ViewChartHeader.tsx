import React from "react";
import ChartToImage from "./ChartToImage";
import { ChartDimens } from "./ViewChartPage";
import CopyAlphabetButton from "./CopyAlphabetButton";
import { useTranslation } from "../common/useTranslation";
import { AlphabetInflated } from "../../models/Alphabet";

interface IProps {
  alphabet: AlphabetInflated;
  setChartDimens: (d: ChartDimens | null) => void;
  canEdit: boolean;
  loggedIn: boolean;
  setEditing: (e: boolean) => void;
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
            {props.alphabet.ownerObj
              ? t("By_name", { name: props.alphabet.ownerObj.name })
              : ""}
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
