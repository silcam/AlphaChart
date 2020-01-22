import React from "react";

interface IProps {
  progress: number;
  indeterminate: boolean;
}

export default function ProgressBar(props: IProps) {
  const style = props.indeterminate ? {} : { width: `${props.progress}%` };
  return (
    <div className="compProgressBar">
      <div
        className={props.indeterminate ? "indeterminate" : ""}
        style={style}
      />
    </div>
  );
}
