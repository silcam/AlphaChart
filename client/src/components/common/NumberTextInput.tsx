import React, { useState } from "react";

interface IProps {
  initialValue?: number;
  setValue: (val: number) => void;
  defaultValue?: number;
}

export default function NumberTextInput(props: IProps) {
  const defaultValue =
    props.defaultValue === undefined ? 0 : props.defaultValue;
  const initialText =
    props.initialValue === undefined ? "" : `${props.initialValue}`;

  const [text, setText] = useState(initialText);

  const update = (newText: string) => {
    const value = parseFloat(newText);
    props.setValue(isNaN(value) ? defaultValue : value);
    setText(newText);
  };

  return (
    <input type="text" value={text} onChange={e => update(e.target.value)} />
  );
}
