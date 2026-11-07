/* eslint-disable react/prop-types */
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows } from "@react-three/drei";
import CodeCube from "./CodeCube";

/**
 * Canvas 3D. File ini HANYA diimpor lewat React.lazy dari HeroVisual,
 * sehingga three.js masuk ke async chunk terpisah.
 */
export default function HeroScene({ lite = false, active = true, onCreated }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 4.2], fov: 35 }}
      style={{ background: "transparent" }}
      onCreated={() => onCreated?.()}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 2]} intensity={1.6} color="#14FFEC" />
      <directionalLight position={[-4, 1, -2]} intensity={0.9} color="#EAF2F0" />

      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2} color="#14FFEC" position={[3, 3, 2]} scale={[3, 3, 1]} />
        <Lightformer form="rect" intensity={1} color="#ffffff" position={[-3, 0, 1]} scale={[3, 3, 1]} />
        <Lightformer form="ring" intensity={1.5} color="#0D7377" position={[0, -3, -2]} scale={[2, 2, 1]} />
      </Environment>

      <Suspense fallback={null}>
        <CodeCube lite={lite} />
      </Suspense>

      <ContactShadows
        position={[0, -1.25, 0]}
        opacity={0.35}
        scale={4}
        blur={2.5}
        far={2}
        color="#000000"
      />
    </Canvas>
  );
}
