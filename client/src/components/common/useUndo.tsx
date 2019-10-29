import { useState } from "react";
import update from "immutability-helper";

export default function useUndo<T>(
  current: T,
  setCurrent: (c: T) => void
): [boolean, boolean, (item: T) => void, () => void, () => void] {
  const [undoStackSize, undoPush, undoPop] = useStack<T>();
  const [redoStackSize, redoPush, redoPop, redoClear] = useStack<T>();
  const canUndo = undoStackSize > 0;
  const canRedo = redoStackSize > 0;

  const push = (item: T) => {
    redoClear();
    undoPush(current);
    setCurrent(item);
  };

  const undo = () => {
    redoPush(current);
    const newCurrent = undoPop();
    setCurrent(newCurrent);
  };

  const redo = () => {
    undoPush(current);
    const newCurrent = redoPop();
    setCurrent(newCurrent);
  };

  return [canUndo, canRedo, push, undo, redo];
}

function useStack<T>(): [number, (item: T) => void, () => T, () => void] {
  const [stack, setStack] = useState<T[]>([]);
  const push = (item: T) =>
    setStack(update(stack, { $splice: [[0, 0, item]] }));
  const pop = () => {
    setStack(update(stack, { $splice: [[0, 1]] }));
    return stack[0];
  };
  const clear = () => setStack([]);

  return [stack.length, push, pop, clear];
}
