import React, { CSSProperties, DetailedHTMLProps, HTMLAttributes } from "react";
import update from "immutability-helper";

interface IProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  iconSize?: "large" | "small";
  styleClass: "iconBlue" | "iconRed" | "iconYellow";
  svgStyle?: CSSProperties;
  children: JSX.Element | JSX.Element[];
}

export type IconProps = Omit<Omit<IProps, "styleClass">, "children">;

export default function Icon(props: IProps) {
  let { iconSize, styleClass, children, svgStyle, ...otherProps } = props;
  svgStyle = update(iconSizer(iconSize) as CSSProperties, {
    $merge: svgStyle || {}
  });

  return (
    <span
      className={`compIcon ${styleClass ? styleClass : ""}`}
      {...otherProps}
    >
      <svg
        style={svgStyle}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        {children}
      </svg>
    </span>
  );
}

function iconSizer(size?: "large" | "small") {
  switch (size) {
    case "large":
      return { width: "32px", height: "32px" };
    case "small":
      return { width: "16px", height: "16px" };
  }
  return {};
}
