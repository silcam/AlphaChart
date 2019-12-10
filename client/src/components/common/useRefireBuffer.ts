import { useState, useEffect, useRef } from "react";

export function useOldRefireBuffer() {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  // console.log(`Timer is ${timer ? "SET" : "NOT SET"}`);

  const runCb = (cb: () => void) => {
    // console.log("Run CB Now");
    cb();
    const doNothingTimer = setTimeout(() => setTimer(null), 3000);
    setTimer(doNothingTimer);
  };

  const withRefireBuffer = (cb: () => void) => {
    if (timer) {
      clearTimeout(timer);
      const doCbTimer = setTimeout(() => runCb(cb), 3000);
      setTimer(doCbTimer);
    } else {
      runCb(cb);
    }
  };

  return withRefireBuffer;
}

export default function useRefireButton() {
  const cbRef = useRef<{ cb: (() => void) | null }>({ cb: null });
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (cbRef.current.cb && !timer) {
      cbRef.current.cb();
      cbRef.current.cb = null;
      setTimer(setTimeout(() => setTimer(null), 3000));
    }
  });

  useEffect(() => {
    // Flush on unmount
    return () => {
      cbRef.current.cb && cbRef.current.cb();
      setTimer(null);
    };
  }, []);

  return (cb: () => void) => {
    cbRef.current.cb = cb;
  };
}
