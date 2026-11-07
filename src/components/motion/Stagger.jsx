/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion } from "framer-motion";
import { CAN_REVEAL } from "./capabilities";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Parent stagger. Anak harus dibungkus <Stagger.Item>.
 *
 * Sengaja memakai `animate` + state, bukan `whileInView` langsung, karena
 * `whileInView` hanya mengubah status saat terjadi TRANSISI masuk viewport.
 * Bila anak baru ter-mount setelah container sudah terlihat (kasus fetch data),
 * tidak ada transisi baru, sehingga anak akan tertinggal di opacity 0 selamanya.
 * Dengan `animate`, anak yang muncul belakangan langsung mewarisi state "show".
 */
export default function Stagger({ children, gap = 0.07, className = "", ...rest }) {
  const [shown, setShown] = useState(false);

  if (!CAN_REVEAL) {
    return (
      <div className={className} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate={shown ? "show" : "hidden"}
      onViewportEnter={() => setShown(true)}
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "", ...rest }) {
  if (!CAN_REVEAL) {
    return (
      <div className={className} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

Stagger.Item = StaggerItem;
