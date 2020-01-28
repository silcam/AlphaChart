import React, { useState } from "react";
import { AlphabetInflated } from "../../models/Alphabet";
import Chart from "./Chart";
import ViewChartHeader from "./ViewChartHeader";
import ExportChart from "./ExportChart";
import { useDispatch } from "react-redux";
import pageSlice from "../../state/pageSlice";
import { useTranslation } from "../common/useTranslation";

interface IProps {
  id: string;
  alphabet: AlphabetInflated;
  setEditing: (e: boolean) => void;
  editAlphabet: () => void;
}

export interface ChartDimens {
  width: number;
  fontSize: number;
}

export default function ViewChartPage(props: IProps) {
  const t = useTranslation();
  const [chartDimens, setChartDimens] = useState<ChartDimens | null>(null);
  const alphabet = props.alphabet;
  const dispatch = useDispatch();
  const [exporting, _setExporting] = useState(false);
  const setExporting = (ex: boolean) => {
    dispatch(pageSlice.actions.setFullScreen(ex));
    _setExporting(ex);
  };

  if (exporting)
    return (
      <ExportChart alphabet={props.alphabet} done={() => setExporting(false)} />
    );

  return (
    <div style={{ paddingBottom: "30px" }}>
      <ViewChartHeader
        alphabet={props.alphabet}
        setChartDimens={setChartDimens}
        setEditing={() => props.setEditing(true)}
        setExporting={() => setExporting(true)}
        editAlphabet={props.editAlphabet}
      />

      <div
        style={
          chartDimens
            ? {
                width: `${chartDimens.width}px`,
                fontSize: chartDimens.fontSize
              }
            : {}
        }
      >
        <Chart alphabet={alphabet} chart={alphabet.chart} setChart={() => {}} />
      </div>
    </div>
  );
}
