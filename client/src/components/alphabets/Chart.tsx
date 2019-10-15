import React from "react";
import { Alphabet, AlphabetLetter, AlphabetChart } from "../../models/Alphabet";
import ImageInput from "./ImageInput";

interface IProps {
  alphabet: Alphabet;
  chart: AlphabetChart;
  edit?: boolean;
  updateLetter: (index: number, letter: Partial<AlphabetLetter>) => void;
}

export default function Chart(props: IProps) {
  const chart = props.chart;
  const alphabetTable = clump(chart.letters, Math.max(chart.cols, 1));
  const cellWidth = 100 / chart.cols;

  return (
    <div id="chart">
      <h2>{props.alphabet.name}</h2>
      <div>
        <div className="alphatable">
          {alphabetTable.map((row, rowIndex) => (
            <div className="alpharow" key={rowIndex}>
              {row.map((abletter, letterIndex) => (
                <div
                  className="alphacell"
                  key={letterIndex}
                  style={{ width: `${cellWidth}%` }}
                >
                  <div className="letter">
                    <div>{abletter.forms[0]}</div>
                    <div>{abletter.forms[1]}</div>
                  </div>

                  <div className="flex-space" />

                  <div>
                    {props.edit ? (
                      <ImageInput
                        alphabet={props.alphabet}
                        letter={abletter}
                        setImagePath={imagePath =>
                          props.updateLetter(
                            flatIndex(chart.cols, rowIndex, letterIndex),
                            { imagePath }
                          )
                        }
                      />
                    ) : (
                      <img
                        src={abletter.imagePath}
                        alt={abletter.exampleWord}
                      />
                    )}
                  </div>
                  <div style={{ marginTop: "8px" }}>
                    {props.edit ? (
                      <input
                        type="text"
                        placeholder="Example Word"
                        value={abletter.exampleWord}
                        onChange={e =>
                          props.updateLetter(
                            flatIndex(chart.cols, rowIndex, letterIndex),
                            { exampleWord: e.target.value }
                          )
                        }
                      />
                    ) : (
                      <div className="exampleWord">{abletter.exampleWord}</div>
                    )}
                  </div>
                </div>
              ))}
              {row.length < chart.cols && (
                <div
                  className="alphacell"
                  style={{
                    width: `${(chart.cols - row.length) * cellWidth}%`
                  }}
                />
              )}
            </div>
          ))}
        </div>
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

function flatIndex(cols: number, rowIndex: number, letterIndex: number) {
  return rowIndex * cols + letterIndex;
}
