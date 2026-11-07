/* eslint-disable react/prop-types */
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Orb glow dekoratif dengan parallax scroll halus.
 * pointer-events-none supaya tidak pernah menangkap klik.
 */
export default function GlowOrb({ className = "", size = 420, color = "rgba(20,255,236,0.35)" }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      style={{
        y: reduced ? 0 : y,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}, transparent 70%)`,
        filter: "blur(60px)",
      }}
      className={`pointer-events-none absolute rounded-full opacity-25 ${className}`}
    />
  );
}
