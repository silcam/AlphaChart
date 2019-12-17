import React from "react";

interface IProps {
  value: string;
  setValue: (v: string) => void;
  options: [string, string][];
}

export default function Select(props: IProps) {
  return (
    <select value={props.value} onChange={e => props.setValue(e.target.value)}>
      {props.options.map(option => (
        <option key={option[0]} value={option[0]}>
          {option[1]}
        </option>
      ))}
    </select>
  );
}
