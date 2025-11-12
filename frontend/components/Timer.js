import { useEffect, useState } from "react";

export default function Timer({ seconds, onEnd, onTick }) {
  const [left, setLeft] = useState(seconds || 0);

  useEffect(() => {
    setLeft(seconds || 0);
  }, [seconds]);

  useEffect(() => {
    if (left <= 0) {
      onEnd && onEnd();
      return;
    }
    const t = setInterval(() => setLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [left]);

  // ✅ send updates to parent on each tick
  useEffect(() => {
    if (onTick) onTick(left);
  }, [left]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className="badge bg-slate-800 text-white">
      Remaining Time: {mm}:{ss}
    </div>
  );
}
