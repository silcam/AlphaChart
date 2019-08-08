import React from "react";
import { Alphabet, AlphabetLetter, AlphabetChart } from "../alphabet/Alphabet";

interface IProps {
  alphabet: Alphabet;
  chart: AlphabetChart;
  edit?: boolean;
  updateLetter: (index: number, letter: Partial<AlphabetLetter>) => void;
}

export default function Chart(props: IProps) {
  const chart = props.chart;
  const alphabetTable = clump(chart.letters, Math.max(chart.cols, 1));

  return (
    <div>
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
                      <img src="/apple.png" alt={abletter.exampleWord} />
                    </div>
                    <div style={{ marginTop: "8px" }}>
                      {props.edit ? (
                        <input
                          type="text"
                          placeholder="Example Word"
                          value={abletter.exampleWord}
                          onChange={e =>
                            props.updateLetter(
                              rowIndex * chart.cols + letterIndex,
                              { exampleWord: e.target.value }
                            )
                          }
                        />
                      ) : (
                        <div className="exampleWord">
                          {abletter.exampleWord}
                        </div>
                      )}
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
