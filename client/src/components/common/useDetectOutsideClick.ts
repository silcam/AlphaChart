import { RefObject, useEffect } from "react";

export default function useDetectOutsideClick(
  ref: RefObject<any>,
  handleOutsideClick: () => void
) {
  const handleAnyClick: EventListener = e => {
    if (ref.current && !ref.current.contains(e.target)) handleOutsideClick();
  };

  useEffect(() => {
    document.addEventListener("click", handleAnyClick);
    return () => document.removeEventListener("click", handleAnyClick);
  });
}
