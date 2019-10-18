import React, { useState } from "react";
import { AlphabetChart, AlphabetLetter } from "../../models/Alphabet";
import update from "immutability-helper";
import keyHandler from "../common/KeyHandler";

interface IProps {
  chart: AlphabetChart;
  setChart: (chart: AlphabetChart) => void;
  autoFocus?: boolean;
}

export default function AddLetter(props: IProps) {
  const [text, setText] = useState("");

  const addLetter = () => {
    if (text.length > 0) {
      const newLetter: AlphabetLetter = {
        forms: formsHeuristic(text),
        exampleWord: "",
        imagePath: ""
      };
      props.setChart(update(props.chart, { letters: { $push: [newLetter] } }));
      setText("");
    }
  };

  const onInput = (newText: string) => {
    const endsWithCommaOrSpace = /[,\s]$/;
    if (endsWithCommaOrSpace.test(newText)) addLetter();
    else setText(newText);
  };

  return (
    <div className="flex-row" style={{ justifyContent: "flex-start" }}>
      <label>Add Letters:</label>
      <input
        type="text"
        value={text}
        onChange={e => onInput(e.target.value)}
        onKeyPress={keyHandler({ Enter: addLetter })}
        autoFocus={props.autoFocus}
      />
    </div>
  );
}

function formsHeuristic(text: string) {
  const [firstLetter, ...rest] = Array.from(text);
  const upper = firstLetter.toLocaleUpperCase();
  const lower = firstLetter.toLocaleLowerCase();
  if (upper === lower) return [text];
  return [`${upper}${rest}`, `${lower}${rest}`];
}