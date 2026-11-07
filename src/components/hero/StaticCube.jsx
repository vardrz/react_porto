/* eslint-disable react/prop-types */
import "./heroVisual.css";

/**
 * Baris "kode" palsu pada tiap face kubus. Lebar bervariasi deterministik
 * supaya keenam sisi tidak identik.
 */
const ROWS = [
  [72, 46, 88, 60],
  [54, 84, 38, 66],
  [90, 52, 44, 74],
  [62, 78, 56, 34],
  [86, 42, 70, 58],
  [48, 92, 36, 80],
];

export default function StaticCube({ className = "", size = 180 }) {
  return (
    <div className={`hv-stage ${className}`} aria-hidden="true">
      <div className="hv-glow" />
      <div className="hv-float">
        <div className="hv-cube" style={{ "--hv-size": `${size}px` }}>
          {["front", "back", "right", "left", "top", "bottom"].map((side, i) => (
            <div key={side} className={`hv-face hv-face--${side}`}>
              {ROWS[i].map((w, j) => (
                <span key={j} className="hv-bar" style={{ width: `${w}%` }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
