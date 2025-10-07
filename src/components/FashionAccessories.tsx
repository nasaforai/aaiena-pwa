import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Handbag = ({ position }: { position: [number, number, number] }) => {
  const bagRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (bagRef.current) {
      bagRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      bagRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 2) * 0.3;
    }
  });

  return (
    <group ref={bagRef} position={position}>
      <mesh>
        <boxGeometry args={[1, 1.2, 0.4]} />
        <meshStandardMaterial color="#8b5cf6" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <torusGeometry args={[0.5, 0.08, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#fbbf24" metalness={1} roughness={0} />
      </mesh>
    </group>
  );
};

const HighHeel = ({ position }: { position: [number, number, number] }) => {
  const heelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (heelRef.current) {
      heelRef.current.rotation.y = -state.clock.getElapsedTime() * 0.4;
      heelRef.current.position.y = position[1] + Math.cos(state.clock.getElapsedTime() * 2) * 0.3;
    }
  });

  return (
    <group ref={heelRef} position={position} rotation={[0, 0, Math.PI / 6]}>
      <mesh position={[0, 0, 0.2]}>
        <boxGeometry args={[0.6, 0.3, 1]} />
        <meshStandardMaterial color="#ec4899" metalness={0.95} roughness={0.05} />
      </mesh>
      <mesh position={[0, -0.4, -0.2]}>
        <cylinderGeometry args={[0.05, 0.08, 0.8, 8]} />
        <meshStandardMaterial color="#fbbf24" metalness={1} roughness={0} />
      </mesh>
    </group>
  );
};

const Jewelry = ({ position }: { position: [number, number, number] }) => {
  const jewelryRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (jewelryRef.current) {
      jewelryRef.current.rotation.x = state.clock.getElapsedTime() * 0.8;
      jewelryRef.current.rotation.y = state.clock.getElapsedTime() * 0.6;
      jewelryRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.3;
    }
  });

  return (
    <group ref={jewelryRef} position={position}>
      <mesh>
        <torusGeometry args={[0.5, 0.15, 16, 32]} />
        <meshStandardMaterial
          color="#06b6d4"
          metalness={1}
          roughness={0}
          emissive="#06b6d4"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh>
        <octahedronGeometry args={[0.3]} />
        <meshStandardMaterial
          color="#fbbf24"
          metalness={1}
          roughness={0}
          emissive="#fbbf24"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
};

const LightBeam = ({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) => {
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (beamRef.current) {
      const material = beamRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 + Math.sin(state.clock.getElapsedTime() * 2) * 0.2;
    }
  });

  return (
    <mesh ref={beamRef} position={position} rotation={rotation}>
      <cylinderGeometry args={[0.1, 2, 15, 8]} />
      <meshBasicMaterial color="#ec4899" transparent opacity={0.3} />
    </mesh>
  );
};

export const FashionAccessories = () => {
  return (
    <group>
      <Handbag position={[-4, 2, 3]} />
      <Handbag position={[4, 1, -3]} />
      
      <HighHeel position={[-3, -1, -4]} />
      <HighHeel position={[3, 0, 4]} />
      
      <Jewelry position={[-5, 3, -2]} />
      <Jewelry position={[5, 2, 2]} />
      <Jewelry position={[0, 4, -5]} />

      {/* Dramatic light beams */}
      <LightBeam position={[-6, 8, -2]} rotation={[0, 0, Math.PI / 6]} />
      <LightBeam position={[6, 8, 2]} rotation={[0, 0, -Math.PI / 6]} />
      <LightBeam position={[0, 8, -6]} rotation={[Math.PI / 6, 0, 0]} />
      <LightBeam position={[0, 8, 6]} rotation={[-Math.PI / 6, 0, 0]} />
    </group>
  );
};
