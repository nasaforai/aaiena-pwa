import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export const InteractiveCamera = () => {
  const { camera, size } = useThree();
  const startTime = useRef(Date.now());
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    const updateDeviceType = () => {
      const width = size.width;
      if (width < 768) {
        setDeviceType("mobile");
      } else if (width < 1024) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };
    
    updateDeviceType();
  }, [size]);

  useFrame((state) => {
    const elapsed = (Date.now() - startTime.current) / 1000;
    const t = state.clock.getElapsedTime();

    // Device-specific parameters
    const isMobile = deviceType === "mobile";
    const isTablet = deviceType === "tablet";
    
    // Adjust camera parameters based on device
    const baseRadius = isMobile ? 8 : isTablet ? 10 : 12;
    const orbitSpeed = isMobile ? 0.1 : 0.15;
    const phaseOneTime = isMobile ? 2 : 3;
    const phaseTwoTime = isMobile ? 4 : 6;
    
    // Adjust FOV for mobile (wider view) - only for PerspectiveCamera
    if ('fov' in camera) {
      if (isMobile) {
        camera.fov = 60;
      } else if (isTablet) {
        camera.fov = 55;
      } else {
        camera.fov = 50;
      }
    }

    // Phase 1: Close-up reveal (faster on mobile)
    if (elapsed < phaseOneTime) {
      const progress = elapsed / phaseOneTime;
      const xMovement = isMobile ? 2 : 3;
      camera.position.x = Math.sin(t * 0.3) * xMovement;
      camera.position.y = 2 + Math.cos(t * 0.2) * 0.5;
      camera.position.z = (isMobile ? 4 : 5) + Math.sin(progress * Math.PI) * -2;
      camera.lookAt(0, 1, 0);
    }
    // Phase 2: Pull back reveal
    else if (elapsed < phaseTwoTime) {
      const progress = (elapsed - phaseOneTime) / (phaseTwoTime - phaseOneTime);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      const xMovement = isMobile ? 2 : 3;
      const xExpansion = isMobile ? 3 : isTablet ? 4 : 5;
      const yExpansion = isMobile ? 2 : isTablet ? 3 : 4;
      const zExpansion = isMobile ? 6 : isTablet ? 8 : 9;
      
      camera.position.x = Math.sin(t * 0.3) * (xMovement + easedProgress * xExpansion);
      camera.position.y = 2 + easedProgress * yExpansion;
      camera.position.z = 3 + easedProgress * zExpansion;
      camera.lookAt(0, 0, 0);
    }
    // Phase 3: Orbital rotation
    else {
      const orbitalTime = elapsed - phaseTwoTime;
      const height = (isMobile ? 4 : isTablet ? 5 : 6) + Math.sin(orbitalTime * 0.2) * (isMobile ? 1 : 2);
      
      camera.position.x = Math.sin(orbitalTime * orbitSpeed) * baseRadius;
      camera.position.y = height;
      camera.position.z = Math.cos(orbitalTime * orbitSpeed) * baseRadius;
      
      // Add subtle camera shake (reduced on mobile)
      const shakeAmount = isMobile ? 0.01 : 0.02;
      camera.position.x += Math.sin(t * 10) * shakeAmount;
      camera.position.y += Math.cos(t * 8) * shakeAmount;
      
      camera.lookAt(0, 1, 0);
    }

    camera.updateProjectionMatrix();
  });

  return null;
};
