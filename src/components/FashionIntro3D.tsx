import { EnhancedFashionDress } from "./EnhancedFashionDress";
import { AdvancedParticleSystem } from "./AdvancedParticleSystem";
import { FashionAccessories } from "./FashionAccessories";
import { RunwayLighting } from "./RunwayLighting";
import { InteractiveCamera } from "./InteractiveCamera";
import { FuturisticFloor } from "./FuturisticFloor";

// Export individual components for flexibility
export {
  EnhancedFashionDress as FashionMannequin,
  AdvancedParticleSystem as FashionParticles,
  InteractiveCamera as CinematicCamera,
};

// Main scene component with all enhanced elements
export const EnhancedFashionScene = () => {
  return (
    <>
      <InteractiveCamera />
      <RunwayLighting />
      <FuturisticFloor />
      
      <EnhancedFashionDress />
      <AdvancedParticleSystem />
      <FashionAccessories />
    </>
  );
};
