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
import { REFERENCE_TOKENS } from '@/lib/referenceTokens';

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
  const viewMode = useSceneStore((s) => s.viewMode);
  const enterFocus = useSceneStore((s) => s.enterFocus);
  const toggleSide = useSceneStore((s) => s.toggleSide);

  const isFocusMode = viewMode === 'focus';

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

  // Target coordinates and shader values
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
      windEnabled && !reducedMotion ? REFERENCE_TOKENS.timing.idleSwayAmplitude : 0.0;

    // Target values depending on whether we are in rail mode or focus mode
    targetRotationY.current = isFlipped ? Math.PI : 0;

    if (isFocusMode) {
      // FOCUS MODE: Active garment enlarges to 40-45% height; neighbours blur and dim like ghosts
      targetScale.current = isActive ? REFERENCE_TOKENS.focus.garmentScale : 0.82;
      targetZ.current = isActive ? 0.65 : -0.55;
      targetMipBias.current = isActive ? 0.0 : REFERENCE_TOKENS.focus.inactiveBlurMipBias;
      targetDim.current = isActive ? 1.0 : REFERENCE_TOKENS.focus.inactiveDim;
    } else {
      // RAIL MODE: Subtle active emphasis; slight neighbour bokeh
      targetScale.current = isActive ? 1.16 : REFERENCE_TOKENS.rail.inactiveScale;
      targetZ.current = isActive ? 0.25 : -0.15;
      targetMipBias.current = blurEnabled && !isActive ? REFERENCE_TOKENS.rail.inactiveBlurMipBias : 0.0;
      targetDim.current = isActive ? 1.0 : REFERENCE_TOKENS.rail.inactiveDim;
    }

    // Smooth lerping
    const lerpFactor = reducedMotion ? 1.0 : Math.min(1.0, delta * 6.5);

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
      wipeProgress.current += delta * 2.2; // ~0.45s wipe duration matching REFERENCE_TOKENS
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

  // Top of plane is at y = 0.35, pinned to rail at y = 1.25
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
          if (isActive) {
            if (isFocusMode) {
              toggleSide();
            } else {
              enterFocus();
            }
          } else {
            onSelect(index);
          }
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

      {/* Damped Spring Hang-Tags (Mounted on Active Garment, click tag to select colourway) */}
      {isActive && hangTagsEnabled && product.variants.map((variant, vIdx) => {
        const isSelected = (colourwayIndex % product.variants.length) === vIdx;
        return (
          <HangTag
            key={variant.id}
            position={[0.44 + vIdx * 0.14, 0.45 - vIdx * 0.03, 0.08 - vIdx * 0.02]}
            tint={variant.colourHex}
            isSelected={isSelected}
            enabled={!reducedMotion}
            onClick={() => {
              setColourway(vIdx);
            }}
          />
        );
      })}
    </group>
  );
}
