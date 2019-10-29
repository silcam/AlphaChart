import React from "react";
import ChartToImage from "./ChartToImage";
import { Link } from "react-router-dom";
import { ChartDimens } from "./ViewChartPage";
import CopyAlphabetButton from "./CopyAlphabetButton";
import { useTranslation } from "../common/I18nContext";

interface IProps {
  id: string;
  setChartDimens: (d: ChartDimens | null) => void;
  canEdit: boolean;
  setEditing: (e: boolean) => void;
}

export default function ViewChartHeader(props: IProps) {
  const t = useTranslation();
  return (
    <div
      className="flex-row"
      style={{
        margin: "20px 0",
        justifyContent: "flex-end"
      }}
    >
      <div className="flex-row">
        <div>
          {props.canEdit ? (
            <button onClick={() => props.setEditing(true)}>
              {t("Edit_chart")}
            </button>
          ) : (
            <CopyAlphabetButton id={props.id} />
          )}
        </div>
        <ChartToImage setChartDimens={props.setChartDimens} />
      </div>
    </div>
  );
}
