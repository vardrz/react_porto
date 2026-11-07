/* eslint-disable react/prop-types */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, MeshTransmissionMaterial, Edges } from "@react-three/drei";
import * as THREE from "three";

const TEAL = "#14FFEC";

// Lebar baris "kode" deterministik (tidak random agar tidak flicker antar render).
const CODE_ROWS = [
  [0.62, 0.34, 0.48, 0.26],
  [0.30, 0.58, 0.40, 0.52],
  [0.50, 0.28, 0.66, 0.36],
  [0.38, 0.60, 0.30, 0.46],
  [0.56, 0.32, 0.42, 0.62],
  [0.28, 0.50, 0.58, 0.34],
];

/**
 * Kubus "code cube": glass rounded box + neon edges + baris kode + core wireframe.
 * `lite` → material & jumlah elemen diturunkan demi device lemah.
 */
export default function CodeCube({ lite = false }) {
  const group = useRef();
  const inner = useRef();
  const cursor = useRef();

  const rows = useMemo(
    () =>
      CODE_ROWS.slice(0, lite ? 4 : 6).map((widths, i) => ({
        y: 0.42 - i * 0.16,
        widths,
      })),
    [lite]
  );

  useFrame((state, delta) => {
    if (!group.current) return;

    // rotasi idle lambat
    group.current.rotation.y += delta * 0.15;

    // parallax pointer di-lerp halus
    const tx = state.pointer.x * 0.25;
    const ty = -state.pointer.y * 0.18;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, ty, 3, delta);
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, tx * 0.5, 3, delta);

    if (inner.current) {
      inner.current.rotation.y -= delta * 0.35;
      inner.current.rotation.x += delta * 0.12;
    }
    if (cursor.current) {
      const t = state.clock.elapsedTime;
      cursor.current.material.opacity = 0.35 + Math.sin(t * 2.2) * 0.35;
    }
  });

  return (
    <group ref={group}>
      <RoundedBox args={[1.6, 1.6, 1.6]} radius={0.09} smoothness={4}>
        {lite ? (
          <meshPhysicalMaterial
            color="#0D7377"
            transmission={0.85}
            thickness={0.5}
            roughness={0.18}
            ior={1.45}
            metalness={0}
            transparent
            opacity={0.9}
          />
        ) : (
          <MeshTransmissionMaterial
            samples={4}
            resolution={256}
            thickness={0.7}
            roughness={0.08}
            ior={1.45}
            chromaticAberration={0.04}
            anisotropy={0.1}
            distortion={0.1}
            color="#0D7377"
          />
        )}
        <Edges color={TEAL} lineWidth={1} transparent opacity={0.55} />
      </RoundedBox>

      {/* baris "kode" mengapung di depan kubus */}
      <group position={[0, 0, 0.62]}>
        {rows.map((row, i) => (
          <group key={i} position={[0, row.y, 0]}>
            {row.widths.map((w, j) => (
              <mesh key={j} position={[(w - 0.6) / 2 + j * 0.02, 0, 0]}>
                <boxGeometry args={[w, 0.035, 0.02]} />
                <meshBasicMaterial color={TEAL} transparent opacity={0.75} toneMapped={false} />
              </mesh>
            ))}
          </group>
        ))}
        {/* kursor berkedip */}
        <mesh ref={cursor} position={[-0.18, -0.5, 0]}>
          <boxGeometry args={[0.14, 0.035, 0.02]} />
          <meshBasicMaterial color={TEAL} transparent opacity={0.7} toneMapped={false} />
        </mesh>
      </group>

      {/* core wireframe */}
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.3, 0]} />
        <meshBasicMaterial color={TEAL} wireframe transparent opacity={0.35} toneMapped={false} />
      </mesh>
    </group>
  );
}
