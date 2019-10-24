import React, { useState, useEffect } from "react";
import { Alphabet } from "../../models/Alphabet";
import Chart from "./Chart";
import Loading from "../common/Loading";
import ViewChartHeader from "./ViewChartHeader";
import { CurrentUserOrNot, userId } from "../../models/User";
import useNetwork from "../common/useNetwork";

interface IProps {
  id: string;
  user: CurrentUserOrNot;
}

export interface ChartDimens {
  width: number;
  fontSize: number;
}

export default function ViewChartPage(props: IProps) {
  const [alphabet, setAlphabet] = useState<Alphabet | null>(null);
  const [chartDimens, setChartDimens] = useState<ChartDimens | null>(null);
  const [, request] = useNetwork();

  useEffect(() => {
    request(axios => axios.get(`/api/alphabets/${props.id}`))
      .then(response => response && setAlphabet(response.data))
      .catch(err => console.error(err));
  }, [props.id]);
  return (
    <div style={{ paddingBottom: "30px" }}>
      <ViewChartHeader
        id={props.id}
        chartLoaded={!!alphabet}
        setChartDimens={setChartDimens}
        canEdit={!!alphabet && alphabet.user === userId(props.user)}
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
            setChart={() => {}}
          />
        )}
      </div>
    </div>
  );
}
