import React, { useState, useEffect } from "react";

// const CHARS = ["|", "/", "-", "\\"];

const STATES = ["...", " ..", "  .", "   ", ".", ".. ", "..."];

export default function Loading() {
  const [stateIndex, setStateIndex] = useState(0);
  const nextCharIndex = stateIndex === STATES.length - 1 ? 0 : stateIndex + 1;
  useEffect(() => {
    const timeout = setTimeout(() => setStateIndex(nextCharIndex), 300);
    return () => clearTimeout(timeout);
  });

  return (
    <h2>
      <pre>{STATES[stateIndex]}</pre>
    </h2>
  );
}
