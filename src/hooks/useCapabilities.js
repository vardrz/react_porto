import { useEffect, useState } from "react";

/**
 * Murni & testable: menentukan tier render 3D dari kapabilitas device.
 * - "off"  : reduced motion aktif → jangan render 3D sama sekali
 * - "lite" : device lemah → 3D sederhana (tanpa transmission/edges tebal)
 * - "full" : semua fitur
 */
export function classifyDevice({ reducedMotion, hardwareConcurrency, deviceMemory }) {
  if (reducedMotion) return "off";
  const cores = typeof hardwareConcurrency === "number" ? hardwareConcurrency : 8;
  if (cores <= 4) return "lite";
  if (typeof deviceMemory === "number" && deviceMemory <= 2) return "lite";
  return "full";
}

function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function readCaps() {
  const reducedMotion =
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : true;
  const hardwareConcurrency = typeof navigator === "undefined" ? undefined : navigator.hardwareConcurrency;
  const deviceMemory = typeof navigator === "undefined" ? undefined : navigator.deviceMemory;
  const webgl = typeof document === "undefined" ? false : detectWebGL();
  const tier = webgl ? classifyDevice({ reducedMotion, hardwareConcurrency, deviceMemory }) : "off";
  return { webgl, reducedMotion, tier };
}

export function useCapabilities() {
  const [caps, setCaps] = useState(() => ({
    webgl: false,
    reducedMotion: true,
    tier: "off",
  }));

  useEffect(() => {
    setCaps(readCaps());
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setCaps(readCaps());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return caps;
}
