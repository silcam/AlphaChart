import React from "react";

interface IProps {
  text: string;
}

export default function WithLineBreaks(props: IProps) {
  // Also insert non-breaking spaces for groups of spaces to preserve indentation
  const pieces = props.text.replace(/ (?= )/g, "\u00A0").split("\n");
  return (
    <div>
      {pieces.map((piece, index) => (
        <span key={index}>
          {piece}
          {index !== pieces.length - 1 && <br />}
        </span>
      ))}
    </div>
  );
}
