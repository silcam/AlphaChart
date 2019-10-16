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
import useStateModified from "../common/useStateModified";

interface IProps {
  alphabet: Alphabet;
  save: (chart: AlphabetChart) => void;
}

export default function ChartEditor(props: IProps) {
  const originalChart = props.alphabet.charts[0];
  const [chart, setChart, chartModified] = useStateModified(originalChart);
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
        className="flex-row"
        style={{
          margin: "24px 0",
          justifyContent: "flex-start"
        }}
      >
        <button onClick={done} disabled={!chartModified}>
          Save and Quit
        </button>
        <Link to={`/alphabets/view/${props.alphabet._id}`}>
          <button onClick={() => {}} className="red">
            Cancel
          </button>
        </Link>
      </div>
      <div className="flex-row">
        <AddLetter
          chart={chart}
          setChart={setChart}
          autoFocus={chart.letters.length === 0}
        />

        <div className="flex-row">
          <label>Columns:</label>
          <NumberPicker value={chart.cols} setValue={setCols} />
        </div>
      </div>
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
