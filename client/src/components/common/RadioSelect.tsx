import React from "react";

interface IProps {
  value: number;
  setValue: (index: number) => void;
  options: string[];
  inputName: string;
}

export default function RadioSelect<T>(props: IProps) {
  return (
    <div>
      {props.options.map((item, index) => (
        <label key={index} style={{ display: "block" }}>
          <input
            type="radio"
            name={props.inputName}
            value={index}
            checked={index === props.value}
            onChange={e => props.setValue(parseInt(e.target.value))}
          />
          {item}
        </label>
      ))}
    </div>
  );
}
