import React from "react";

interface IProps {
  value: number;
  setValue: (v: number) => void;
  minimum?: number;
  maximum?: number;
  noType?: boolean;
  increment?: number;
}

export default function NumberPicker(props: IProps) {
  const minValue = props.minimum === undefined ? 1 : props.minimum;
  const valueText = props.value >= minValue ? props.value.toString() : "";
  const increment = props.increment || 1;
  const setValue = (val: number) =>
    props.setValue(
      Math.min(Math.max(minValue, val), props.maximum || Infinity)
    );

  return (
    <div className="NumberPicker">
      <input
        type="text"
        value={valueText}
        onChange={e => setValue(parseInt(e.target.value) || 0)}
        size={2}
        disabled={!!props.noType}
      />
      <button
        onClick={e => setValue(props.value - increment)}
        disabled={props.value <= minValue}
      >
        -
      </button>
      <button
        onClick={e => setValue(props.value + increment)}
        disabled={props.maximum !== undefined && props.value >= props.maximum}
      >
        +
      </button>
    </div>
  );
}
