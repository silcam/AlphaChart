import React, { useState, ReactNode } from "react";

interface IProps {
  buttonText: string;
  onMainClick: () => void;
  renderContextMenu: (props: { hideMenu: () => void }) => ReactNode;
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
