import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

export const EnhancedFashionDress = () => {
  const dressRef = useRef<THREE.Group>(null);
  const innerLayerRef = useRef<THREE.Mesh>(null);
  const middleLayerRef = useRef<THREE.Mesh>(null);
  const outerLayerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (dressRef.current) {
      dressRef.current.rotation.y = Math.sin(t * 0.3) * 0.1;
      dressRef.current.position.y = Math.sin(t * 0.5) * 0.1;
    }

    // Animate each layer independently for flowing fabric effect
    if (innerLayerRef.current) {
      innerLayerRef.current.rotation.y += 0.005;
    }
    if (middleLayerRef.current) {
      middleLayerRef.current.rotation.y -= 0.003;
    }
    if (outerLayerRef.current) {
      outerLayerRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={dressRef}>
      {/* Inner Layer - Bright Purple Core */}
      <mesh ref={innerLayerRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[1.2, 2.5, 4, 32]} />
        <MeshDistortMaterial
          color="#6A0DFF"
          distort={0.4}
          speed={2}
          metalness={0.9}
          roughness={0.1}
          emissive="#6A0DFF"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Middle Layer - Medium Purple Flow */}
      <mesh ref={middleLayerRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[1.4, 2.8, 4.2, 32]} />
        <MeshDistortMaterial
          color="#BB90FF"
          distort={0.6}
          speed={1.5}
          metalness={0.8}
          roughness={0.2}
          emissive="#BB90FF"
          emissiveIntensity={0.3}
          opacity={0.7}
          transparent
        />
      </mesh>

      {/* Outer Layer - Light Purple Shimmer */}
      <mesh ref={outerLayerRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[1.6, 3.1, 4.4, 32]} />
        <MeshDistortMaterial
          color="#DEC4FF"
          distort={0.8}
          speed={1}
          metalness={0.7}
          roughness={0.3}
          emissive="#DEC4FF"
          emissiveIntensity={0.2}
          opacity={0.5}
          transparent
        />
      </mesh>

      {/* Dress Top/Bodice */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.8, 1.2, 1, 32]} />
        <MeshDistortMaterial
          color="#F6F2FF"
          distort={0.3}
          speed={2}
          metalness={0.95}
          roughness={0.05}
          emissive="#EBE1FD"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Accent Rings - Bright Purple */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 1.5 - i * 1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5 + i * 0.2, 0.05, 16, 32]} />
          <meshStandardMaterial
            color="#6A0DFF"
            metalness={1}
            roughness={0}
            emissive="#6A0DFF"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
};
