import React from "react";
import ChartToImage from "./ChartToImage";
import { Link } from "react-router-dom";
import { ChartDimens } from "./ViewChartPage";
import CopyAlphabetButton from "./CopyAlphabetButton";

interface IProps {
  id: string;
  chartLoaded?: boolean;
  setChartDimens: (d: ChartDimens | null) => void;
  canEdit: boolean;
}

export default function ViewChartHeader(props: IProps) {
  return (
    <div
      className="flex-row"
      style={{
        margin: "20px 0",
        justifyContent: "flex-end"
      }}
    >
      {props.chartLoaded && (
        <div className="flex-row">
          <div>
            {props.canEdit ? (
              <Link to={`/alphabets/edit/${props.id}/chart`}>
                <button>Edit Chart</button>
              </Link>
            ) : (
              <CopyAlphabetButton id={props.id} />
            )}
          </div>
          <ChartToImage setChartDimens={props.setChartDimens} />
        </div>
      )}
    </div>
  );
}
