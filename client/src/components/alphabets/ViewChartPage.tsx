import React, { useState } from "react";
import { Alphabet } from "../../models/Alphabet";
import Chart from "./Chart";
import ViewChartHeader from "./ViewChartHeader";
import { CurrentUserOrNot, userId } from "../../models/User";

interface IProps {
  id: string;
  user: CurrentUserOrNot;
  alphabet: Alphabet;
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
        id={props.id}
        setChartDimens={setChartDimens}
        canEdit={alphabet.user === userId(props.user)}
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
