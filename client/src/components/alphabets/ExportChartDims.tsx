import React from "react";
import { Dims } from "./PageDims";
import { useTranslation } from "../common/useTranslation";

interface IProps {
  targetDims: Dims;
  fittedChartDims: Dims;
}

export default function ExportChartDims(props: IProps) {
  const t = useTranslation();
  const colors = colorizeDims(props);
  return (
    <div>
      <label>{t("Dimensions")} </label>
      <pre>
        <b>{t("Target")} :</b> {props.targetDims[0]} x {props.targetDims[1]}
      </pre>
      <pre>
        <b>{t("Actual")} :</b>{" "}
        <span style={{ color: colors[0] }}>{props.fittedChartDims[0]}</span> x{" "}
        <span style={{ color: colors[1] }}>{props.fittedChartDims[1]}</span>
      </pre>
    </div>
  );
}

function colorizeDims(props: IProps) {
  return props.targetDims.map((tDim, i) => {
    const percent = props.fittedChartDims[i] / tDim;
    if (percent === 1) return "#fff"; // White
    if (percent >= 0.9) return "#00ff1a"; // Green
    if (percent >= 0.75) return "#f3d100"; // Yellow
    return "#ff0800"; // Red
  });
}
