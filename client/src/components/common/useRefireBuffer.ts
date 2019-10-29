import { useState } from "react";

export default function useRefireBuffer() {
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
