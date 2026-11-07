/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/**
 * Angka yang naik dari 0 ke `to` sekali saat masuk viewport.
 * `suffix` dirender statis setelah angka (mis. "+ YEARS").
 */
export default function Counter({ to, suffix = "", duration = 900, className = "" }) {
  const value = Number(to) || 0;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setN(value);
      return;
    }
    const controls = animate(0, value, {
      duration: duration / 1000,
      ease: "easeOut",
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduced]);

  return (
    <span ref={ref} className={className} aria-label={`${value}${suffix}`}>
      {n}
      {suffix}
    </span>
  );
}
