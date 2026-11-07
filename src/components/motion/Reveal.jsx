/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { CAN_REVEAL } from "./capabilities";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Reveal satu blok saat masuk viewport. Sekali saja (once).
 */
export default function Reveal({ children, delay = 0, y = 24, className = "", as = "div", ...rest }) {
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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
