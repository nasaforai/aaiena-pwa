import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export const InteractiveCamera = () => {
  const { camera } = useThree();
  const startTime = useRef(Date.now());

  useFrame((state) => {
    const elapsed = (Date.now() - startTime.current) / 1000;
    const t = state.clock.getElapsedTime();

    // Phase 1 (0-3s): Close-up reveal
    if (elapsed < 3) {
      const progress = elapsed / 3;
      camera.position.x = Math.sin(t * 0.3) * 3;
      camera.position.y = 2 + Math.cos(t * 0.2) * 0.5;
      camera.position.z = 5 + Math.sin(progress * Math.PI) * -2;
      camera.lookAt(0, 1, 0);
    }
    // Phase 2 (3-6s): Pull back reveal
    else if (elapsed < 6) {
      const progress = (elapsed - 3) / 3;
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      
      camera.position.x = Math.sin(t * 0.3) * (3 + easedProgress * 5);
      camera.position.y = 2 + easedProgress * 4;
      camera.position.z = 3 + easedProgress * 9;
      camera.lookAt(0, 0, 0);
    }
    // Phase 3 (6s+): Orbital rotation
    else {
      const orbitalTime = elapsed - 6;
      const radius = 12;
      const height = 6 + Math.sin(orbitalTime * 0.2) * 2;
      
      camera.position.x = Math.sin(orbitalTime * 0.15) * radius;
      camera.position.y = height;
      camera.position.z = Math.cos(orbitalTime * 0.15) * radius;
      
      // Add subtle camera shake for dynamic feel
      camera.position.x += Math.sin(t * 10) * 0.02;
      camera.position.y += Math.cos(t * 8) * 0.02;
      
      camera.lookAt(0, 1, 0);
    }

    camera.updateProjectionMatrix();
  });

  return null;
};
