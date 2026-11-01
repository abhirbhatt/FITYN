'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { Product } from '@/lib/types/commerce';
import { createGarmentMaterial } from './shaders/garmentShader';
import { HangTag } from './HangTag';
import { Hanger } from './Hanger';
import { assetPath } from '@/lib/utils/assetPath';
import { useSceneStore } from '@/store/useSceneStore';

interface GarmentPlaneProps {
  product: Product;
  index: number;
  isActive: boolean;
  isFlipped: boolean;
  colourwayIndex: number;
  windEnabled: boolean;
  blurEnabled: boolean;
  hangTagsEnabled: boolean;
  reducedMotion: boolean;
  onSelect: (index: number) => void;
}

export function GarmentPlane({
  product,
  index,
  isActive,
  isFlipped,
  colourwayIndex,
  windEnabled,
  blurEnabled,
  hangTagsEnabled,
  reducedMotion,
  onSelect,
}: GarmentPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const setColourway = useSceneStore((s) => s.setColourway);

  // Current variant based on colourwayIndex
  const currentVariant = product.variants[colourwayIndex % product.variants.length];
  const nextVariant = product.variants[(colourwayIndex + 1) % product.variants.length];

  // Load textures
  const [frontTex, backTex, nextFrontTex, nextBackTex] = useLoader(THREE.TextureLoader, [
    assetPath(currentVariant.frontTexture),
    assetPath(currentVariant.backTexture),
    assetPath(nextVariant.frontTexture),
    assetPath(nextVariant.backTexture),
  ]);

  // Phase offset so garments do not sway identically in lockstep
  const phase = useMemo(() => index * 0.75, [index]);

  // Create custom shader material
  const material = useMemo(() => {
    return createGarmentMaterial(frontTex, backTex, phase);
  }, [frontTex, backTex, phase]);

  // Wipe transition state
  const wipeProgress = useRef(0);
  const isTransitioningWipe = useRef(false);
  const isInitialMount = useRef(true);

  // Sync textures when product changes
  useEffect(() => {
    if (material) {
      material.uniforms.uFrontTex.value = frontTex;
      material.uniforms.uBackTex.value = backTex;
      material.uniforms.uWipeProgress.value = 0.0;
      isTransitioningWipe.current = false;
    }
  }, [product.id, frontTex, backTex, material]);

  // When colourway index changes after initial mount, trigger noise wipe
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (material) {
      material.uniforms.uNextFrontTex.value = nextFrontTex;
      material.uniforms.uNextBackTex.value = nextBackTex;
      wipeProgress.current = 0;
      isTransitioningWipe.current = true;
    }
  }, [colourwayIndex, material, nextFrontTex, nextBackTex]);

  // Smooth rotation target for 180deg flip
  const targetRotationY = useRef(0);
  const targetScale = useRef(1);
  const targetZ = useRef(0);
  const targetMipBias = useRef(0);
  const targetDim = useRef(1.0);

  useFrame((state, delta) => {
    if (!groupRef.current || !meshRef.current || !material) return;

    const time = state.clock.getElapsedTime();
    material.uniforms.uTime.value = time;

    // Wind sway amplitude
    material.uniforms.uSwayAmplitude.value =
      windEnabled && !reducedMotion ? 0.038 : 0.0;

    // Target values
    targetRotationY.current = isFlipped ? Math.PI : 0;
    targetScale.current = isActive ? 1.04 : 0.94;
    targetZ.current = isActive ? 0.35 : -0.15;
    targetMipBias.current = blurEnabled && !isActive ? 2.8 : 0.0;
    targetDim.current = isActive ? 1.0 : 0.60;

    // Smooth lerping
    const lerpFactor = reducedMotion ? 1.0 : Math.min(1.0, delta * 7.0);

    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetRotationY.current,
      lerpFactor,
    );

    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      targetZ.current,
      lerpFactor,
    );

    const currentScale = groupRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale.current, lerpFactor);
    groupRef.current.scale.set(newScale, newScale, newScale);

    // Mip bias lerp for smooth bokeh transition
    material.uniforms.uMipBias.value = THREE.MathUtils.lerp(
      material.uniforms.uMipBias.value,
      targetMipBias.current,
      lerpFactor,
    );

    // Spotlight focus: smooth dimming of inactive garments
    material.uniforms.uDim.value = THREE.MathUtils.lerp(
      material.uniforms.uDim.value,
      targetDim.current,
      lerpFactor,
    );

    // Handle colourway noise wipe animation
    if (isTransitioningWipe.current) {
      wipeProgress.current += delta * 1.6; // ~0.65s wipe duration
      if (wipeProgress.current >= 1.0) {
        wipeProgress.current = 1.0;
        isTransitioningWipe.current = false;
        // Swap textures at end of wipe
        material.uniforms.uFrontTex.value = nextFrontTex;
        material.uniforms.uBackTex.value = nextBackTex;
        material.uniforms.uWipeProgress.value = 0.0;
      } else {
        material.uniforms.uWipeProgress.value = wipeProgress.current;
      }
    }
  });

  // Hanger coordinates: Top of plane is at y = 0.35, pinned to rail at y = 1.25
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 3D Boutique Metallic Hanger Hooked Over Rail */}
      <Hanger />

      {/* Garment Textured Quad */}
      <mesh
        ref={meshRef}
        position={[0, 0.25, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(index);
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <planeGeometry args={[1.75, 1.75]} />
        <primitive object={material} attach="material" />
      </mesh>

      {/* Damped Spring Hang-Tag (Mounted on Active Garment, click to cycle colourway) */}
      {isActive && hangTagsEnabled && (
        <HangTag
          position={[0.45, 0.45, 0.08]}
          enabled={!reducedMotion}
          onClick={() => {
            const nextIdx = (colourwayIndex + 1) % product.variants.length;
            setColourway(nextIdx);
          }}
        />
      )}
    </group>
  );
}

