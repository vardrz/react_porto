/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Kartu dengan tilt 3D mengikuti pointer. Otomatis nonaktif saat tidak ada
 * hover (touch device). Bungkus isi kartu; beri className untuk styling kartu.
 */
export default function TiltCard({ children, max = 6, className = "", ...rest }) {
  const ref = useRef(null);
  const [canTilt, setCanTilt] = useState(false);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 260, damping: 22 });
  const sy = useSpring(py, { stiffness: 260, damping: 22 });

  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanTilt(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  function handleMove(e) {
    if (!canTilt || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }

  function handleLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  if (!canTilt) {
    return (
      <div className={className} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 900 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
