import React, { useState, useEffect } from "react";
import { ChromePicker } from "react-color";

interface IProps {
  color: string;
  setColor: (c: string) => void;
  setInputValid?: (v: boolean) => void;
  disabled?: boolean;
}

export default function ColorInput(props: IProps) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div className="compColorInput" onBlur={() => setExpanded(false)}>
      <div
        className="color-picker-preview"
        style={{ backgroundColor: props.color }}
        onClick={toggleExpanded}
      />
      {expanded && (
        <div className="color-picker">
          <ChromePicker
            color={props.color}
            onChange={color => props.setColor(color.hex)}
          />
        </div>
      )}
    </div>
  );
}

export function SimpleColorInput(props: IProps) {
  const [text, setText] = useState(props.color.replace(/^#/, ""));
  const inputValid = validColor(text);

  useEffect(() => {
    if (inputValid) props.setColor(`#${text}`);
    props.setInputValid && props.setInputValid(inputValid);
  }, [text]);

  return (
    <div className="compSimpleColorInput">
      #
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        disabled={props.disabled}
        size={8}
      />
      {inputValid && (
        <div className="color-demo" style={{ backgroundColor: `#${text}` }} />
      )}
    </div>
  );
}

function validColor(color: string) {
  const validHexChars = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F"
  ];
  return (
    [3, 6, 8].includes(color.length) &&
    color
      .toLowerCase()
      .split("")
      .every(char => validHexChars.includes(char))
  );
}
