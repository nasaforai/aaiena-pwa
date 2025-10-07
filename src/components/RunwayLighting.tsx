import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const RunwayLighting = () => {
  const spotlight1Ref = useRef<THREE.SpotLight>(null);
  const spotlight2Ref = useRef<THREE.SpotLight>(null);
  const spotlight3Ref = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (spotlight1Ref.current) {
      spotlight1Ref.current.position.x = Math.sin(t * 0.5) * 8;
      spotlight1Ref.current.intensity = 2 + Math.sin(t * 2) * 0.5;
    }

    if (spotlight2Ref.current) {
      spotlight2Ref.current.position.z = Math.cos(t * 0.7) * 8;
      spotlight2Ref.current.intensity = 1.5 + Math.cos(t * 1.5) * 0.3;
    }

    if (spotlight3Ref.current) {
      spotlight3Ref.current.position.x = Math.cos(t * 0.6) * 8;
      spotlight3Ref.current.position.z = Math.sin(t * 0.6) * 8;
      spotlight3Ref.current.intensity = 2 + Math.sin(t * 1.8) * 0.4;
    }
  });

  return (
    <group>
      {/* Enhanced ambient lighting */}
      <ambientLight intensity={0.4} />
      
      {/* Primary moving spotlights - Purple palette */}
      <spotLight
        ref={spotlight1Ref}
        position={[10, 12, 10]}
        angle={0.4}
        penumbra={1}
        intensity={2}
        castShadow
        color="#6A0DFF"
        distance={30}
      />
      
      <spotLight
        ref={spotlight2Ref}
        position={[-10, 12, -10]}
        angle={0.4}
        penumbra={1}
        intensity={1.5}
        castShadow
        color="#BB90FF"
        distance={30}
      />
      
      <spotLight
        ref={spotlight3Ref}
        position={[0, 15, 0]}
        angle={0.5}
        penumbra={1}
        intensity={2}
        color="#DEC4FF"
        distance={30}
      />

      {/* Accent point lights */}
      <pointLight position={[5, 3, 5]} intensity={1.5} color="#6A0DFF" distance={15} />
      <pointLight position={[-5, 3, -5]} intensity={1.5} color="#BB90FF" distance={15} />
      <pointLight position={[0, -2, 0]} intensity={1} color="#DEC4FF" distance={20} />
      
      {/* Rim lights for dramatic effect */}
      <pointLight position={[0, 8, -12]} intensity={2} color="#EBE1FD" distance={25} />
      <pointLight position={[0, 8, 12]} intensity={2} color="#F6F2FF" distance={25} />
    </group>
  );
};
