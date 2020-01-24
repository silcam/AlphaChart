import React, { useState, ReactNode } from "react";
import useDetectOutsideClick from "./useDetectOutsideClick";
import LnkBtn from "./LnkBtn";

interface IProps {
  buttonText: string;
  onMainClick: () => void;
  renderContextMenu: (props: { hideMenu: () => void }) => ReactNode;
  lnkBtn?: boolean;
}

export default function OptionButton(props: IProps) {
  const [showMenu, setShowMenu] = useState(false);
  const toggleShowMenu = () => setShowMenu(!showMenu);

  return (
    <div className="compOptionButton">
      <button onClick={props.onMainClick}>{props.buttonText}</button>
      <button onClick={toggleShowMenu}>▼</button>
      {showMenu && (
        <div className="contextMenu">
          {props.renderContextMenu({ hideMenu: () => setShowMenu(false) })}
        </div>
      )}
    </div>
  );
}

export function OptionButtonSimple(props: Omit<IProps, "onMainClick">) {
  const [showMenu, setShowMenu] = useState(false);
  const toggleShowMenu = () => setShowMenu(!showMenu);

  let divRef = React.createRef<HTMLDivElement>();
  useDetectOutsideClick(divRef, () => setShowMenu(false));

  return (
    <div className="compOptionButtonSimple" ref={divRef}>
      {props.lnkBtn ? (
        <LnkBtn text={`${props.buttonText} ▼`} onClick={toggleShowMenu} />
      ) : (
        <button onClick={toggleShowMenu}>{`${props.buttonText} ▼`}</button>
      )}
      {showMenu && (
        <div className="contextMenu">
          {props.renderContextMenu({ hideMenu: () => setShowMenu(false) })}
        </div>
      )}
    </div>
  );
}
