import React from "react";

interface IProps {
  onEnter?: () => void;
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
        }
      }}
    >
      {props.children}
    </div>
  );
}
