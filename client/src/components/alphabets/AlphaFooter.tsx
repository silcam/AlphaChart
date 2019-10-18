import React from "react";
import WithLineBreaks from "../common/WithLineBreaks";

interface IProps {
  edit?: boolean;
  text?: string;
  setText: (t: string) => void;
  styles: any;
}

export default function AlphaFooter(props: IProps) {
  return (
    <div className="alpharow">
      <div className="alphacell alphafooter" style={props.styles}>
        {props.edit ? (
          <textarea
            value={props.text}
            onChange={e => props.setText(e.target.value)}
            placeholder="Optional Footer"
            rows={props.text ? props.text.split("\n").length * 2 : 1}
          />
        ) : (
          <WithLineBreaks text={props.text || ""} />
        )}
      </div>
    </div>
  );
}
