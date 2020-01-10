import React, { useState } from "react";
import { AlphabetInflated } from "../../models/Alphabet";
import Chart from "./Chart";
import ViewChartHeader from "./ViewChartHeader";

interface IProps {
  id: string;
  alphabet: AlphabetInflated;
  setEditing: (e: boolean) => void;
}

export interface ChartDimens {
  width: number;
  fontSize: number;
}

export default function ViewChartPage(props: IProps) {
  const [chartDimens, setChartDimens] = useState<ChartDimens | null>(null);
  const alphabet = props.alphabet;

  return (
    <div style={{ paddingBottom: "30px" }}>
      <ViewChartHeader
        alphabet={props.alphabet}
        setChartDimens={setChartDimens}
        setEditing={props.setEditing}
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
