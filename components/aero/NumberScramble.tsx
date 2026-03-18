"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface NumberScrambleProps {
  value: number;
  scrambleDuration?: number;
  className?: string;
  pad?: number;
}

export default function NumberScramble({
  value,
  scrambleDuration = 1000,
  className = "",
  pad = 0,
}: NumberScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(pad > 0 ? "0".repeat(pad) : "0");
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    const steps = 20;
    const interval = scrambleDuration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      if (step >= steps) {
        const str = value.toString();
        setDisplay(pad > 0 ? str.padStart(pad, "0") : str);
        setSettled(true);
        clearInterval(timer);
      } else {
        // Random digits
        const len = Math.max(value.toString().length, pad);
        const random = Array.from({ length: len }, () =>
          Math.floor(Math.random() * 10).toString()
        ).join("");
        setDisplay(random);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isInView, value, scrambleDuration, pad]);

  // After settling, show the live value (important for countdown timer updates)
  const liveDisplay = pad > 0 ? value.toString().padStart(pad, "0") : value.toString();

  return (
    <span
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {settled ? liveDisplay : display}
    </span>
  );
}
