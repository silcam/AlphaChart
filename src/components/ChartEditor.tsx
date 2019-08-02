import React, { useState } from "react";
import { Alphabet } from "../alphabet/Alphabet";
import { Link } from "react-router-dom";
import { List, fromJS } from "immutable";

interface IProps {
  langName: string;
  alphabet: Alphabet;
}

export default function ChartEditor(props: IProps) {
  const [cols, setCols] = useState(5);

  const alphabetTable = clump(props.alphabet, Math.max(cols, 1));

  return (
    <div>
      <p>
        <Link to="/letters">Edit Alphabet</Link>
      </p>
      <div>
        <label>
          Columns:
          <input
            type="text"
            value={cols > 0 ? cols : ""}
            onChange={e => setCols(parseInt(e.target.value) || 0)}
          />
        </label>
      </div>
      <div>
        {alphabetTable.map(row => (
          <tr>
            {row.map(letters => (
              <td>
                <h2>{letters.join(", ")}</h2>
              </td>
            ))}
          </tr>
        ))}
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
