import React from "react";
import ChartToImage from "./ChartToImage";
import { Link } from "react-router-dom";
import { ChartDimens } from "./ViewChartPage";

interface IProps {
  id: string;
  chartLoaded?: boolean;
  setChartDimens: (d: ChartDimens | null) => void;
}

export default function ViewChartHeader(props: IProps) {
  return (
    <div
      className="flex-row"
      style={{
        margin: "20px 0"
      }}
    >
      <div style={{ fontSize: "x-large" }}>
        <Link to={`/`}>Home</Link>
      </div>
      {props.chartLoaded && (
        <div className="flex-row">
          <div>
            <Link to={`/alphabets/edit/${props.id}/chart`}>
              <button>Edit Chart</button>
            </Link>
          </div>
          <ChartToImage setChartDimens={props.setChartDimens} />
        </div>
      )}
    </div>
  );
}