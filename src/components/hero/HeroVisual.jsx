/* eslint-disable react/prop-types */
import { Component, Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useCapabilities } from "../../hooks/useCapabilities";
import StaticCube from "./StaticCube";

const HeroScene = lazy(() => import("./HeroScene"));

/** Menangkap error chunk/WebGL agar tidak mematikan seluruh halaman. */
class SceneBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.setState({ failed: true });
  }
  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

/**
 * Dua lapis: StaticCube (instan, CSS) dan HeroScene (async chunk, fade-in).
 * StaticCube dilepas saat scene siap supaya tidak ada dua kubus.
 */
export default function HeroVisual() {
  const { webgl, tier } = useCapabilities();
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);

  const enabled = webgl && tier !== "off";

  // mount chunk saat idle
  useEffect(() => {
    if (!enabled) return;
    let idleId;
    let timeoutId;
    const start = () => setMounted(true);

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(start, { timeout: 2500 });
    } else {
      timeoutId = window.setTimeout(start, 1200);
    }
    return () => {
      if (idleId !== undefined && "cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [enabled]);

  // pause render loop saat keluar viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "120px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-square w-full max-w-[260px] sm:max-w-[340px] lg:max-w-[460px]"
    >
      {/* lapisan CSS: selalu ada sampai scene siap */}
      <div
        className="absolute inset-0 transition-opacity duration-500 ease-premium"
        style={{ opacity: ready ? 0 : 1, pointerEvents: "none" }}
      >
        <StaticCube size={170} className="h-full w-full" />
      </div>

      {mounted && enabled ? (
        <SceneBoundary>
          <Suspense fallback={null}>
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: ready ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            >
              <HeroScene
                lite={tier === "lite"}
                active={visible}
                onCreated={() => setReady(true)}
              />
            </motion.div>
          </Suspense>
        </SceneBoundary>
      ) : null}

      {/* fade-in trigger: canvas pertama kali render */}
    </div>
  );
}
