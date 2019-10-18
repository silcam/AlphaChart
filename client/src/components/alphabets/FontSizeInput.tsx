import React, { useState } from "react";
import NumberPicker from "../common/NumberPicker";

interface IProps {
  fontSize: string;
  setFontSize: (val: string) => void;
}

export default function FontSizeInput(props: IProps) {
  const value = parseFloat(props.fontSize);
  return (
    <NumberPicker
      value={value * 10}
      setValue={v => props.setFontSize(`${v / 10.0}em`)}
      noType
    />
  );
}

// Abandoned in place
// This was my first idea, but then I thought of the other one
export function RawFontSizeInput(props: IProps) {
  const [input, setInput] = useState(`${parseFloat(props.fontSize)}`);

  const isValid = (input: string) => !isNaN(parseFloat(input));
  const inputValid = isValid(input);

  const updateInput = (newInput: string) => {
    setInput(newInput);
    if (isValid(newInput)) props.setFontSize(`${newInput}em`);
  };

  return (
    <input
      type="text"
      value={input}
      onChange={e => updateInput(e.target.value)}
      data-invalid={!inputValid}
    />
  );
}
