'use client';

import React from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { assetPath } from '@/lib/utils/assetPath';

export function RailGeometry() {
  const railTexture = useTexture(assetPath('/garments/textures/rail.webp'));
  const shadowTexture = useTexture(assetPath('/garments/textures/ground-shadow.webp'));

  // Repeat rail texture horizontally along the long bar
  railTexture.wrapS = THREE.RepeatWrapping;
  railTexture.wrapT = THREE.ClampToEdgeWrapping;
  railTexture.repeat.set(8, 1);

  return (
    <group>
      {/* Horizontal Rail Bar (8 segments = 16 triangles) */}
      <mesh position={[0, 1.25, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.024, 0.024, 22, 8]} />
        <meshStandardMaterial
          map={railTexture}
          metalness={0.85}
          roughness={0.25}
          color="#D8D8D2"
        />
      </mesh>

      {/* Subtle Wall/Floor Ambient Shadow Plane */}
      <mesh position={[0, -1.6, -0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 3.5]} />
        <meshBasicMaterial
          map={shadowTexture}
          transparent={true}
          opacity={0.75}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

