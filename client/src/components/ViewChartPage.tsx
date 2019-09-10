import React, { useState, useEffect } from "react";
import { Alphabet } from "../alphabet/Alphabet";
import Axios from "axios";
import Chart from "./Chart";
import Loading from "./Loading";
import ViewChartHeader from "./ViewChartHeader";

interface IProps {
  id: string;
}

export interface ChartDimens {
  width: number;
  fontSize: number;
}

export default function ViewChartPage(props: IProps) {
  const [alphabet, setAlphabet] = useState<Alphabet | null>(null);
  const [chartDimens, setChartDimens] = useState<ChartDimens | null>(null);
  useEffect(() => {
    Axios.get(`/api/alphabets/${props.id}`).then(response =>
      setAlphabet(response.data)
    );
  }, [props.id]);
  return (
    <div id="page-root">
      <ViewChartHeader
        id={props.id}
        chartLoaded={!!alphabet}
        setChartDimens={setChartDimens}
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
        {alphabet === null ? (
          <Loading />
        ) : (
          <Chart
            alphabet={alphabet}
            chart={alphabet.charts[0]}
            updateLetter={() => {}}
          />
        )}
      </div>
    </div>
  );
}
