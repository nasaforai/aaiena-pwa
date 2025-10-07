import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const FuturisticFloor = () => {
  const gridRef = useRef<THREE.LineSegments>(null);
  const reflectivePlaneRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (gridRef.current) {
      // Pulsing grid effect
      (gridRef.current.material as THREE.LineBasicMaterial).opacity = 0.3 + Math.sin(t * 2) * 0.2;
    }

    if (reflectivePlaneRef.current) {
      // Subtle plane movement
      reflectivePlaneRef.current.position.y = -3 + Math.sin(t * 0.5) * 0.1;
    }
  });

  // Create grid geometry
  const gridSize = 40;
  const gridDivisions = 40;
  const gridGeometry = new THREE.BufferGeometry();
  const gridMaterial = new THREE.LineBasicMaterial({
    color: "#6A0DFF",
    transparent: true,
    opacity: 0.3,
  });

  const points = [];
  const halfSize = gridSize / 2;

  for (let i = 0; i <= gridDivisions; i++) {
    const position = (i / gridDivisions) * gridSize - halfSize;
    
    // Horizontal lines
    points.push(-halfSize, 0, position);
    points.push(halfSize, 0, position);
    
    // Vertical lines
    points.push(position, 0, -halfSize);
    points.push(position, 0, halfSize);
  }

  gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));

  return (
    <group>
      {/* Reflective floor plane */}
      <mesh
        ref={reflectivePlaneRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -3, 0]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#0E0022"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1}
        />
      </mesh>

      {/* Grid overlay */}
      <primitive
        ref={gridRef}
        object={new THREE.LineSegments(gridGeometry, gridMaterial)}
        position={[0, -2.95, 0]}
      />

      {/* Accent grid lights */}
      {[-15, -5, 5, 15].map((x) =>
        [-15, -5, 5, 15].map((z) => (
          <pointLight
            key={`${x}-${z}`}
            position={[x, -2.5, z]}
            intensity={0.5}
            color="#6A0DFF"
            distance={8}
          />
        ))
      )}
    </group>
  );
};
