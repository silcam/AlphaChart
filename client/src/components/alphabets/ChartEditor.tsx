import React, { useState } from "react";
import { AlphabetChart, Alphabet, AlphabetLetter } from "../../models/Alphabet";
import { Link } from "react-router-dom";
import NumberPicker from "../common/NumberPicker";
import update from "immutability-helper";
import Chart from "./Chart";

interface IProps {
  alphabet: Alphabet;
  save: (chart: AlphabetChart) => void;
}

export default function ChartEditor(props: IProps) {
  const originalChart = props.alphabet.charts[0];
  const [chart, setChart] = useState(originalChart);
  const setCols = (cols: number) =>
    setChart(update(chart, { cols: { $set: cols } }));
  const updateLetter = (index: number, letter: Partial<AlphabetLetter>) => {
    setChart(update(chart, { letters: { [index]: { $merge: letter } } }));
  };

  const done = () => props.save(chart);

  return (
    <div id="page-root">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          margin: "24px 0"
        }}
      >
        <Link to="/letters">Edit Alphabet</Link>
        <div>
          <label>Columns:</label>
          <NumberPicker value={chart.cols} setValue={setCols} />
        </div>
        <button onClick={done} style={{ marginTop: 0 }}>
          Done
        </button>
      </div>
      <Chart
        alphabet={props.alphabet}
        chart={chart}
        updateLetter={updateLetter}
        edit
      />
    </div>
  );
}
