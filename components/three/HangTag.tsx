'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { assetPath } from '@/lib/utils/assetPath';

interface HangTagProps {
  position?: [number, number, number];
  enabled?: boolean;
  onClick?: () => void;
}

  export function HangTag({
    position = [0.42, 0.15, 0.05],
    enabled = true,
    onClick,
  }: HangTagProps) {
    const groupRef = useRef<THREE.Group>(null);
    const tagTexture = useTexture(assetPath('/garments/textures/hang-tag.webp'));

    // Spring-damper physics variables
    const theta = useRef(0);
    const omega = useRef(0);

    useFrame((_, delta) => {
      if (!groupRef.current) return;

      if (!enabled) {
        groupRef.current.rotation.z = 0;
        return;
      }

      const dt = Math.min(delta, 0.1);
      const k = 18.0; // Spring stiffness
      const damping = 2.4; // Damping ratio

      // Ambient micro-oscillation mimicking garment draft
      const windForce = Math.sin(Date.now() * 0.003) * 0.4;
      const accel = -k * theta.current - damping * omega.current + windForce;

      omega.current += accel * dt;
      theta.current += omega.current * dt;

      // Apply rotation around Z-axis at top suspension pivot
      groupRef.current.rotation.z = theta.current * 0.12;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.002) * 0.05;
    });

    return (
      <group position={position}>
        {/* Pivot at top where cord hangs */}
        <group ref={groupRef}>
            <mesh
              position={[0, -0.22, 0]}
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
              onPointerOver={() => {
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'auto';
              }}
            >
              <planeGeometry args={[0.22, 0.44]} />
              <meshBasicMaterial
                map={tagTexture}
                transparent={true}
                alphaTest={0.4}
                side={THREE.DoubleSide}
              />
            </mesh>
        </group>
      </group>
    );
  }

