import React, { useState } from "react";
import { Alphabet } from "../alphabet/Alphabet";
import { Link } from "react-router-dom";
import { List, fromJS } from "immutable";
import NumberPicker from "./NumberPicker";

interface IProps {
  langName: string;
  alphabet: Alphabet;
}

export default function ChartEditor(props: IProps) {
  const [cols, setCols] = useState(5);

  const alphabetTable = clump(props.alphabet, Math.max(cols, 1));

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
        <div>
          <label>Columns:</label>
          <NumberPicker value={cols} setValue={setCols} />
        </div>
        <div>
          <Link to="/letters">Edit Alphabet</Link>
        </div>
      </div>
      <h2>{props.langName}</h2>
      <div>
        <table style={{ width: "100%" }}>
          <tbody>
            {alphabetTable.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((letters, letterIndex) => (
                  <td className="alphacell" key={letterIndex}>
                    <div className="letter">
                      <div>{letters.get(0)}</div>
                      <div>{letters.get(1)}</div>
                    </div>
                    <div>
                      <img src="/apple.png" />
                    </div>
                    <div style={{ marginTop: "8px" }}>
                      <input type="text" placeholder="Example Word" />
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

function clump<T>(list: List<T>, clumpsOf: number): List<List<T>> {
  const empty: T[][] = [];
  const table = list.reduce((table, item, index) => {
    if (index % clumpsOf === 0) table.push([item]);
    else table[table.length - 1].push(item);
    return table;
  }, empty);
  return fromJS(table);
}
