/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Tombol/tautan yang sedikit "menarik" ke arah pointer.
 * `as` = "a" (default, butuh href) atau "button".
 */
export default function MagneticButton({ children, className = "", as = "a", ...rest }) {
  const ref = useRef(null);
  const [canMagnet, setCanMagnet] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanMagnet(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  function handleMove(e) {
    if (!canMagnet || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * 12);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 12);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const Comp = as === "button" ? motion.button : motion.a;

  return (
    <Comp
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ x: sx, y: sy }}
      whileHover={canMagnet ? { scale: 1.02 } : undefined}
      whileTap={{ scale: 0.98 }}
      className={className}
      {...rest}
    >
      {children}
    </Comp>
  );
}
