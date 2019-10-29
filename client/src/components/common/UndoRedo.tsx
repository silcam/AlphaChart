import React from "react";
import UndoIcon from "../icons/UndoIcon";
import RedoIcon from "../icons/RedoIcon";

interface IProps {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
}

export default function UndoRedo(props: IProps) {
  return props.canUndo || props.canRedo ? (
    <div className="compUndoRedo">
      <UndoIcon
        onClick={() => props.canUndo && props.undo()}
        iconSize="large"
        data-disabled={!props.canUndo}
      />
      <RedoIcon
        onClick={() => props.canRedo && props.redo()}
        iconSize="large"
        data-disabled={!props.canRedo}
      />
    </div>
  ) : null;
}
