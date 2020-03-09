import React from "react";
import WithLineBreaks from "../common/WithLineBreaks";
import { useTranslation } from "../common/useTranslation";

interface IProps {
  edit?: boolean;
  text?: string;
  setText: (t: string) => void;
  styles: any;
}

export default function AlphaFooter(props: IProps) {
  const t = useTranslation();
  return (
    <div className="alpharow">
      <div className="alphacell alphafooter" style={props.styles}>
        {props.edit ? (
          <textarea
            value={props.text}
            onChange={e => props.setText(e.target.value)}
            placeholder={t("Optional_footer")}
            rows={props.text ? props.text.split("\n").length * 2 : 1}
          />
        ) : (
          <WithLineBreaks text={props.text || ""} />
        )}
      </div>
    </div>
  );
}
