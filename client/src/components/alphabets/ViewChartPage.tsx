import React, { useState } from "react";
import { AlphabetInflated } from "../../models/Alphabet";
import Chart from "./Chart";
import ViewChartHeader from "./ViewChartHeader";
import { useSelector } from "react-redux";
import { AppState } from "../../state/appState";
import useCanEdit from "./useCanEdit";

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
  const user = useSelector((state: AppState) => state.currentUser.user);
  const canEdit = useCanEdit()(alphabet);

  return (
    <div style={{ paddingBottom: "30px" }}>
      <ViewChartHeader
        alphabet={props.alphabet}
        setChartDimens={setChartDimens}
        canEdit={canEdit}
        loggedIn={!!user}
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
