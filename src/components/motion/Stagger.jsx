/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { CAN_REVEAL } from "./capabilities";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Parent stagger. Anak harus dibungkus <Stagger.Item>.
 * Tanpa IntersectionObserver, semua anak langsung terlihat.
 */
export default function Stagger({ children, gap = 0.07, className = "", ...rest }) {
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
      whileInView="show"
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
