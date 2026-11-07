/**
 * Lapisan dekoratif global: glow teal, grid halus, dan noise.
 * Semua CSS statis — tanpa JS, tanpa request aset.
 * pointer-events-none supaya tidak pernah menangkap klik.
 */
export default function BackgroundFX() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* glow kanan atas */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 72% 8%, rgba(20,255,236,0.10), transparent 70%)",
        }}
      />

      {/* grid halus dengan fade radial */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(234,242,240,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(234,242,240,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at 50% 30%, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black, transparent 75%)",
        }}
      />

      {/* noise */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
