import React, { useState } from "react";
import {
  AlphabetChart,
  Alphabet,
  AlphabetLetter,
  blankAlphabetLetter
} from "../../models/Alphabet";
import { Link } from "react-router-dom";
import NumberPicker from "../common/NumberPicker";
import update from "immutability-helper";
import Chart from "./Chart";
import AddLetter from "./AddLetter";
import SideMenu from "./SideMenu";

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
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const done = () => props.save(chart);

  return (
    <div style={{ paddingBottom: "30px" }}>
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
      <AddLetter
        chart={chart}
        setChart={setChart}
        autoFocus={chart.letters.length === 0}
      />
      <Chart
        alphabet={props.alphabet}
        chart={chart}
        updateLetter={updateLetter}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        edit
      />
      {selectedIndex >= 0 && (
        <SideMenu
          letter={chart.letters[selectedIndex]}
          key={`${selectedIndex}-${chart.letters.length}`}
          close={() => setSelectedIndex(-1)}
          setLetter={letter =>
            setChart(
              update(chart, { letters: { [selectedIndex]: { $set: letter } } })
            )
          }
          deleteLetter={() => {
            setChart(
              update(chart, { letters: { $splice: [[selectedIndex, 1]] } })
            );
            setSelectedIndex(-1);
          }}
          insertBefore={() =>
            setChart(
              update(chart, {
                letters: {
                  $splice: [[selectedIndex, 0, blankAlphabetLetter()]]
                }
              })
            )
          }
          insertAfter={() => {
            setChart(
              update(chart, {
                letters: {
                  $splice: [[selectedIndex + 1, 0, blankAlphabetLetter()]]
                }
              })
            );
            setSelectedIndex(selectedIndex + 1);
          }}
        />
      )}
    </div>
  );
}
