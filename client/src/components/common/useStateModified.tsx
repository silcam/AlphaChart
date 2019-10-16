import { useState } from "react";

export default function useStateModified<T>(
  initialValue: T
): [T, (value: T) => void, boolean] {
  const [value, setValue] = useState(initialValue);
  const [modified, setModified] = useState(false);
  const exportSetValue = (newValue: T) => {
    setValue(newValue);
    setModified(true);
  };
  return [value, exportSetValue, modified];
}
