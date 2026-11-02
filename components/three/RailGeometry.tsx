'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { assetPath } from '@/lib/utils/assetPath';
import { useSceneStore } from '@/store/useSceneStore';

export function RailGeometry() {
  const groupRef = useRef<THREE.Group>(null);
  const viewMode = useSceneStore((s) => s.viewMode);
  const railTexture = useTexture(assetPath('/garments/textures/rail.webp'));
  const shadowTexture = useTexture(assetPath('/garments/textures/ground-shadow.webp'));

  // Repeat rail texture horizontally along the long bar
  railTexture.wrapS = THREE.RepeatWrapping;
  railTexture.wrapT = THREE.ClampToEdgeWrapping;
  railTexture.repeat.set(8, 1);

  // Smoothly fade/translate rail when entering focus mode
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const isFocus = viewMode === 'focus';
    const targetY = isFocus ? 0.35 : 0.0;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      Math.min(1.0, delta * 4.0),
    );
  });

  return (
    <group ref={groupRef}>
      {/* Horizontal Steel Rail Bar (spanning width) */}
      <mesh position={[0, 1.25, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.024, 0.024, 22, 12]} />
        <meshStandardMaterial
          map={railTexture}
          metalness={0.88}
          roughness={0.22}
          color="#D8D8D2"
        />
      </mesh>

      {/* Left Vertical Suspension Cable / Chain Drop Rod */}
      <mesh position={[-5.2, 2.875, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 3.25, 8]} />
        <meshStandardMaterial
          color="#B5B5AC"
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>
      {/* Left Cable-to-Rail Mounting Collar Bracket */}
      <mesh position={[-5.2, 1.25, 0]}>
        <cylinderGeometry args={[0.038, 0.038, 0.08, 12]} />
        <meshStandardMaterial
          color="#486C2F"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Right Vertical Suspension Cable / Chain Drop Rod */}
      <mesh position={[5.2, 2.875, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 3.25, 8]} />
        <meshStandardMaterial
          color="#B5B5AC"
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>
      {/* Right Cable-to-Rail Mounting Collar Bracket */}
      <mesh position={[5.2, 1.25, 0]}>
        <cylinderGeometry args={[0.038, 0.038, 0.08, 12]} />
        <meshStandardMaterial
          color="#486C2F"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Center Auxiliary Suspension Cable for wide desktop viewports */}
      <mesh position={[0, 3.125, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 3.75, 8]} />
        <meshStandardMaterial
          color="#B5B5AC"
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.034, 0.034, 0.07, 12]} />
        <meshStandardMaterial
          color="#2A2A2A"
          metalness={0.8}
          roughness={0.3}
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
