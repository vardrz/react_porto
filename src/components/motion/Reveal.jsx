/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion } from "framer-motion";
import { CAN_REVEAL } from "./capabilities";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Reveal satu blok saat masuk viewport. Sekali saja (once).
 *
 * Memakai `animate` + state (bukan `whileInView`) dengan alasan yang sama
 * seperti Stagger: `whileInView` hanya bereaksi pada transisi masuk viewport.
 * Kalau blok ini di-remount atau anaknya baru muncul setelah container sudah
 * terlihat (mis. konten hasil fetch), `whileInView` tidak akan pernah
 * menyalakan animasinya dan konten tertinggal transparan.
 */
export default function Reveal({ children, delay = 0, y = 24, className = "", as = "div", ...rest }) {
  const [shown, setShown] = useState(false);

  if (!CAN_REVEAL) {
    const Plain = as;
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    );
  }

  const Comp = motion[as] || motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      onViewportEnter={() => setShown(true)}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
