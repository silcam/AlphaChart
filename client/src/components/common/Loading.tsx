import React, { useState, useEffect } from "react";

// const CHARS = ["|", "/", "-", "\\"];

const STATES = ["   ", ".", ".. ", "...", "...", " ..", "  ."];

export default function Loading(props: { small?: boolean }) {
  return props.small ? (
    <span className="compLoading">
      <Dots />
    </span>
  ) : (
    <h2 className="compLoading">
      <Dots />
    </h2>
  );
}

function Dots() {
  const [stateIndex, setStateIndex] = useState(0);
  const nextCharIndex = stateIndex === STATES.length - 1 ? 0 : stateIndex + 1;
  useEffect(() => {
    const timeout = setTimeout(() => setStateIndex(nextCharIndex), 300);
    return () => clearTimeout(timeout);
  });

  return <pre style={{ margin: 0 }}>{STATES[stateIndex]}</pre>;
}
