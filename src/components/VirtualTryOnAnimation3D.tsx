import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Floating clothing icon component
function ClothingIcon({ position, speed, delay }: { position: [number, number, number], speed: number, delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime() + delay;
      meshRef.current.position.x = position[0] + Math.sin(time * speed) * 1.5;
      meshRef.current.position.y = position[1] + Math.cos(time * speed * 0.8) * 0.8;
      meshRef.current.position.z = position[2] + Math.cos(time * speed) * 1.5;
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.3, 0.4, 0.1]} />
      <meshStandardMaterial color="#c084fc" opacity={0.8} transparent />
    </mesh>
  );
}

// Particle/sparkle effect
function Sparkle({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.scale.setScalar(0.1 + Math.sin(time * 2) * 0.05);
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      if (material) {
        material.opacity = 0.5 + Math.sin(time * 3) * 0.3;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#f0abfc" transparent opacity={0.6} />
    </mesh>
  );
}

// Main avatar/mannequin
function Avatar() {
  const groupRef = useRef<THREE.Group>(null);
  const clothingRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.3;
    }
    
    // Animate clothing appearing/disappearing
    if (clothingRef.current) {
      const time = state.clock.getElapsedTime();
      const scale = 0.9 + Math.sin(time * 0.5) * 0.1;
      clothingRef.current.scale.setScalar(scale);
      
      // Color transition effect
      const material = clothingRef.current.material as THREE.MeshStandardMaterial;
      if (material && material.color) {
        const hue = (Math.sin(time * 0.3) + 1) * 0.5;
        material.color.setHSL(0.75 + hue * 0.1, 0.7, 0.6);
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 1.5, 0.4]} />
        <meshStandardMaterial color="#e9d5ff" />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#f3e8ff" />
      </mesh>
      
      {/* Animated Clothing Layer */}
      <mesh ref={clothingRef} position={[0, 0, 0]}>
        <boxGeometry args={[0.85, 1.55, 0.45]} />
        <meshStandardMaterial 
          color="#c084fc" 
          transparent 
          opacity={0.7}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.6, 0.2, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="#e9d5ff" />
      </mesh>
      <mesh position={[0.6, 0.2, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="#e9d5ff" />
      </mesh>
    </group>
  );
}

// Rotating ring effect
function MagicRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.01;
      ringRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={ringRef} position={[0, 0, 0]}>
      <torusGeometry args={[2, 0.05, 16, 100]} />
      <meshBasicMaterial color="#f0abfc" transparent opacity={0.3} />
    </mesh>
  );
}

// Main scene
function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-5, 3, -5]} intensity={0.5} color="#c084fc" />
      <pointLight position={[5, -3, -5]} intensity={0.5} color="#f0abfc" />
      
      <Avatar />
      <MagicRing />
      
      {/* Floating clothing icons */}
      <ClothingIcon position={[2, 1, 0]} speed={0.5} delay={0} />
      <ClothingIcon position={[-2, 0.5, 0]} speed={0.6} delay={2} />
      <ClothingIcon position={[0, 2, 1.5]} speed={0.4} delay={4} />
      
      {/* Sparkles */}
      <Sparkle position={[1.5, 1.5, 0.5]} />
      <Sparkle position={[-1.5, 1, 0.5]} />
      <Sparkle position={[0.5, -0.5, 1]} />
      <Sparkle position={[-0.5, 2, -0.5]} />
      
    </>
  );
}

export const VirtualTryOnAnimation3D: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 1, 6], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  );
};
