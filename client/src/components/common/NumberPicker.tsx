import React from "react";

interface IProps {
  value: number;
  setValue: (v: number) => void;
  minimum?: number;
  maximum?: number;
  noType?: boolean;
}

export default function NumberPicker(props: IProps) {
  const minValue = props.minimum === undefined ? 1 : props.minimum;
  const valueText = props.value >= minValue ? props.value.toString() : "";

  return (
    <div className="NumberPicker">
      <input
        type="text"
        value={valueText}
        onChange={e => props.setValue(parseInt(e.target.value) || 0)}
        size={2}
        disabled={!!props.noType}
      />
      <button
        onClick={e => props.setValue(props.value - 1)}
        disabled={props.value <= minValue}
      >
        -
      </button>
      <button
        onClick={e => props.setValue(props.value + 1)}
        disabled={props.maximum !== undefined && props.value >= props.maximum}
      >
        +
      </button>
    </div>
  );
}
