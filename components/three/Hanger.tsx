'use client';

import React from 'react';
import * as THREE from 'three';

export function Hanger() {
  return (
    <group position={[0, 0, 0]}>
      {/* Curved Hook Hooked Over Rail (Rail is at y = 1.25) */}
      <mesh position={[0, 1.28, 0]} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[0.05, 0.008, 8, 16, Math.PI * 1.35]} />
        <meshStandardMaterial
          color="#3A3A38"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Vertical Hook Stem */}
      <mesh position={[0.015, 1.20, 0]}>
        <cylinderGeometry args={[0.007, 0.007, 0.12, 8]} />
        <meshStandardMaterial
          color="#3A3A38"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Shoulder Bar (Holding Garment Shoulders) */}
      <mesh position={[0, 1.13, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.01, 0.01, 0.72, 8]} />
        <meshStandardMaterial
          color="#4A4A48"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}
