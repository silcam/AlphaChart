import React, { useState } from "react";
import { AlphabetChart, DraftAlphabet } from "../alphabet/Alphabet";
import { Link } from "react-router-dom";
import NumberPicker from "./NumberPicker";
import update from "immutability-helper";

interface IProps {
  alphabet: DraftAlphabet;
  setAlphabetAndDone: (a: DraftAlphabet) => void;
}

export default function ChartEditor(props: IProps) {
  const [chart, setChart] = useState(props.alphabet.chart);
  const setCols = (cols: number) =>
    setChart(update(chart, { cols: { $set: cols } }));
  const setExampleWord = (index: number, word: string) => {
    setChart(
      update(chart, { letters: { [index]: { exampleWord: { $set: word } } } })
    );
  };

  const alphabetTable = clump(chart.letters, Math.max(chart.cols, 1));

  const done = () =>
    props.setAlphabetAndDone({
      ...props.alphabet,
      chart: chart
    });

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
      <h2>{props.alphabet.name}</h2>
      <div>
        <table style={{ width: "100%" }}>
          <tbody>
            {alphabetTable.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((abletter, letterIndex) => (
                  <td className="alphacell" key={letterIndex}>
                    <div className="letter">
                      <div>{abletter.forms[0]}</div>
                      <div>{abletter.forms[1]}</div>
                    </div>
                    <div>
                      <img src="/apple.png" />
                    </div>
                    <div style={{ marginTop: "8px" }}>
                      <input
                        type="text"
                        placeholder="Example Word"
                        value={abletter.exampleWord}
                        onChange={e =>
                          setExampleWord(
                            rowIndex * chart.cols + letterIndex,
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function clump<T>(list: T[], clumpsOf: number): T[][] {
  const empty: T[][] = [];
  return list.reduce((table, item, index) => {
    if (index % clumpsOf === 0) table.push([item]);
    else table[table.length - 1].push(item);
    return table;
  }, empty);
}
