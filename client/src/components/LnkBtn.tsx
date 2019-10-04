import React from "react";

interface IProps {
  text: string;
  onClick: () => void;
}

export default function LnkBtn(props: IProps) {
  return (
    <a
      href="#"
      onClick={event => {
        event.preventDefault();
        props.onClick();
      }}
    >
      {props.text}
    </a>
  );
}
