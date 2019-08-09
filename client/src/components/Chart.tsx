import React from "react";
import { Alphabet, AlphabetLetter, AlphabetChart } from "../alphabet/Alphabet";
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

  return (
    <div>
      <h2>{props.alphabet.name}</h2>
      <div>
        <table className="alphatable">
          <tbody>
            {alphabetTable.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <tr>
                  {row.map((abletter, letterIndex) => (
                    <td className="alphacell alphacell-upper" key={letterIndex}>
                      <div className="letter">
                        <div>{abletter.forms[0]}</div>
                        <div>{abletter.forms[1]}</div>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  {row.map((abletter, letterIndex) => (
                    <td className="alphacell alphacell-lower" key={letterIndex}>
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
                          <div className="exampleWord">
                            {abletter.exampleWord}
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              </React.Fragment>
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

function flatIndex(cols: number, rowIndex: number, letterIndex: number) {
  return rowIndex * cols + letterIndex;
}
