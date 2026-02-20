"use client";

import { Canvas } from "@react-three/fiber";
import { Stars, Float, OrbitControls } from "@react-three/drei";

function FloatingSphere({ position, color }) {
  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={3}>
      <mesh position={position}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
      </mesh>
    </Float>
  );
}

export default function FoodScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        {/* Stars background */}
        <Stars radius={100} depth={50} count={5000} factor={4} fade />

        {/* Floating Food Inspired Objects */}
        <FloatingSphere position={[-3, 1, 0]} color="#facc15" />
        <FloatingSphere position={[3, -1, 0]} color="#fb923c" />
        <FloatingSphere position={[0, 2, -2]} color="#fbbf24" />

        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}