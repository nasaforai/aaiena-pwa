import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleLayerProps {
  count: number;
  radius: number;
  speed: number;
  size: number;
  colors: string[];
}

const ParticleLayer = ({ count, radius, speed, size, colors }: ParticleLayerProps) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colorArray] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colorValues = new Float32Array(count * 3);
    const colorObjects = colors.map(c => new THREE.Color(c));

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = radius + Math.random() * 2;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const color = colorObjects[Math.floor(Math.random() * colorObjects.length)];
      colorValues[i * 3] = color.r;
      colorValues[i * 3 + 1] = color.g;
      colorValues[i * 3 + 2] = color.b;
    }

    return [positions, colorValues];
  }, [count, radius, colors]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += speed * 0.001;
      pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colorArray}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const AdvancedParticleSystem = () => {
  return (
    <group>
      {/* Inner Layer - Bright purple particles */}
      <ParticleLayer
        count={2000}
        radius={3}
        speed={3}
        size={0.15}
        colors={["#6A0DFF", "#BB90FF", "#F6F2FF"]}
      />

      {/* Middle Layer - Medium purple with trails */}
      <ParticleLayer
        count={2500}
        radius={6}
        speed={1.5}
        size={0.1}
        colors={["#BB90FF", "#DEC4FF", "#EBE1FD"]}
      />

      {/* Outer Layer - Light purple ambient */}
      <ParticleLayer
        count={3000}
        radius={10}
        speed={0.5}
        size={0.08}
        colors={["#DEC4FF", "#EBE1FD", "#F6F2FF"]}
      />
    </group>
  );
};
