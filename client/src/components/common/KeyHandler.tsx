import React from "react";

interface IProps {
  onEnter?: () => void;
  onTab?: () => void;
  children: JSX.Element | JSX.Element[];
}

export default function KeyHandler(props: IProps) {
  return (
    <div
      onKeyPress={e => {
        switch (e.key) {
          case "Enter":
            props.onEnter && props.onEnter();
            break;
          case "Tab":
            props.onTab && props.onTab();
            break;
        }
      }}
    >
      {props.children}
    </div>
  );
}
