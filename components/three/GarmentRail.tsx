'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { PRODUCTS } from '@/data/products';
import { useSceneStore } from '@/store/useSceneStore';
import { useQualityStore } from '@/store/useQualityStore';
import { GarmentPlane } from './GarmentPlane';
import { RailGeometry } from './RailGeometry';

const GARMENT_SPACING = 2.15;

export function GarmentRail() {
  const railGroupRef = useRef<THREE.Group>(null);
  const { camera, invalidate } = useThree();

  const {
    activeGarmentIndex,
    side,
    garmentColourways,
    routeFocus,
    setActiveGarment,
  } = useSceneStore();

  const {
    windEnabled,
    blurEnabled,
    hangTagsEnabled,
    reducedMotion,
  } = useQualityStore();

  // Route-based camera targets
  const targetCamZ = useRef(4.3);
  const targetCamY = useRef(0.0);
  const targetCamX = useRef(0);
  const targetRailX = useRef(0);

  useFrame((_, delta) => {
    if (!railGroupRef.current) return;

    // Calculate target rail position so active garment is centered at x = 0
    targetRailX.current = -activeGarmentIndex * GARMENT_SPACING;

    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;

    // Route-aware camera positions
    if (routeFocus === 'product') {
      targetCamZ.current = isDesktop ? 3.15 : 3.4;
      targetCamY.current = isDesktop ? 0.08 : 0.25;
      targetCamX.current = isDesktop ? 0.72 : 0;
    } else if (routeFocus === 'collections') {
      targetCamZ.current = 5.2;
      targetCamY.current = 0.25;
      targetCamX.current = 0;
    } else {
      // 'rail' or default
      targetCamZ.current = 4.3;
      targetCamY.current = 0.0;
      targetCamX.current = 0;
    }

    const lerpSpeed = reducedMotion ? 1.0 : Math.min(1.0, delta * 5.5);

    // Smoothly ease rail group along X
    railGroupRef.current.position.x = THREE.MathUtils.lerp(
      railGroupRef.current.position.x,
      targetRailX.current,
      lerpSpeed,
    );

    // Smoothly ease camera position
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX.current, lerpSpeed);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY.current, lerpSpeed);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ.current, lerpSpeed);

    // Request continuous frames during active motion
    invalidate();
  });

  return (
    <group position={[0, -0.28, 0]}>
      <RailGeometry />

      {/* Rail Group of 7 Garments */}
      <group ref={railGroupRef}>
        {PRODUCTS.map((product, idx) => {
          const posX = idx * GARMENT_SPACING;
          const isActive = idx === activeGarmentIndex;

          // When viewing a specific product detail, do not render inactive background garments
          if (routeFocus === 'product' && !isActive) {
            return null;
          }

          return (
            <group key={product.id} position={[posX, 0, 0]}>
              <GarmentPlane
                product={product}
                index={idx}
                isActive={isActive}
                isFlipped={isActive && side === 'back'}
                colourwayIndex={garmentColourways[idx] ?? 0}
                windEnabled={windEnabled}
                blurEnabled={blurEnabled}
                hangTagsEnabled={hangTagsEnabled}
                reducedMotion={reducedMotion}
                onSelect={(selectedIdx) => {
                  setActiveGarment(selectedIdx, product.id);
                }}
              />
            </group>
          );
        })}
      </group>
    </group>
  );
}

