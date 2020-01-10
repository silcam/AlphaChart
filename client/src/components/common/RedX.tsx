import React from "react";
import LnkBtn from "./LnkBtn";

interface IProps {
  onClick: () => void;
}

export default function(props: IProps) {
  return (
    <span className="compRedX">
      <LnkBtn text="x" onClick={props.onClick} />
    </span>
  );
}
