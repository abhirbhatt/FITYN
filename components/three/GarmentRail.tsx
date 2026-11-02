'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { PRODUCTS } from '@/data/products';
import { useSceneStore } from '@/store/useSceneStore';
import { useQualityStore } from '@/store/useQualityStore';
import { REFERENCE_TOKENS } from '@/lib/referenceTokens';
import { GarmentPlane } from './GarmentPlane';
import { RailGeometry } from './RailGeometry';

const GARMENT_SPACING = REFERENCE_TOKENS.rail.spacing;

export function GarmentRail() {
  const railGroupRef = useRef<THREE.Group>(null);
  const { camera, gl, invalidate } = useThree();

  const {
    activeGarmentIndex,
    side,
    garmentColourways,
    routeFocus,
    viewMode,
    setActiveGarment,
  } = useSceneStore();

  const {
    windEnabled,
    blurEnabled,
    hangTagsEnabled,
    reducedMotion,
  } = useQualityStore();

  // Route-based camera targets
  const targetCamZ = useRef<number>(REFERENCE_TOKENS.camera.defaultZ);
  const targetCamY = useRef<number>(REFERENCE_TOKENS.camera.defaultY);
  const targetCamX = useRef<number>(REFERENCE_TOKENS.camera.defaultX);
  const targetRailX = useRef<number>(0);

  // Horizontal Pointer Drag & Wheel Scroll Physics
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragLastX = useRef(0);
  const totalDragDistance = useRef(0);
  const dragVelocity = useRef(0);
  const dragOffset = useRef(0);
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const dom = gl.domElement;
    if (!dom) return;

    const onPointerDown = (e: PointerEvent) => {
      const state = useSceneStore.getState();
      if (state.viewMode !== 'rail' || state.routeFocus !== 'rail') return;
      isDragging.current = true;
      dragStartX.current = e.clientX;
      dragLastX.current = e.clientX;
      totalDragDistance.current = 0;
      dragVelocity.current = 0;
      try {
        dom.setPointerCapture(e.pointerId);
      } catch {}
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - dragLastX.current;
      dragLastX.current = e.clientX;
      totalDragDistance.current += Math.abs(dx);

      // Sensitivity mapping screen pixels to 3D world units
      const sensitivity = 0.0052;
      dragOffset.current += dx * sensitivity;
      dragVelocity.current = dx * sensitivity;
      invalidate();

      // Live update active garment to nearest center while dragging
      if (railGroupRef.current) {
        const liveX = railGroupRef.current.position.x;
        const liveIdx = Math.max(
          0,
          Math.min(PRODUCTS.length - 1, Math.round(-liveX / GARMENT_SPACING)),
        );
        if (liveIdx !== useSceneStore.getState().activeGarmentIndex) {
          useSceneStore.getState().setActiveGarment(liveIdx, PRODUCTS[liveIdx].id);
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      try {
        dom.releasePointerCapture(e.pointerId);
      } catch {}

      // If user dragged noticeably, snap to the momentum-projected nearest garment
      if (totalDragDistance.current > 10 && railGroupRef.current) {
        const projectedX =
          railGroupRef.current.position.x + dragVelocity.current * 8.0;
        const targetIdx = Math.max(
          0,
          Math.min(PRODUCTS.length - 1, Math.round(-projectedX / GARMENT_SPACING)),
        );
        useSceneStore.getState().setActiveGarment(targetIdx, PRODUCTS[targetIdx].id);
        dragOffset.current = 0;
        invalidate();
      }
    };

    const onWheel = (e: WheelEvent) => {
      const state = useSceneStore.getState();
      if (state.viewMode !== 'rail' || state.routeFocus !== 'rail') return;

      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;
      if (isHorizontal) {
        const delta = e.shiftKey ? e.deltaY : e.deltaX;
        dragOffset.current -= delta * 0.0035;
        invalidate();

        if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
        wheelTimeout.current = setTimeout(() => {
          if (railGroupRef.current) {
            const targetIdx = Math.max(
              0,
              Math.min(
                PRODUCTS.length - 1,
                Math.round(-railGroupRef.current.position.x / GARMENT_SPACING),
              ),
            );
            useSceneStore.getState().setActiveGarment(targetIdx, PRODUCTS[targetIdx].id);
            dragOffset.current = 0;
            invalidate();
          }
        }, 140);
      }
    };

    dom.addEventListener('pointerdown', onPointerDown);
    dom.addEventListener('pointermove', onPointerMove);
    dom.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('pointercancel', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      dom.removeEventListener('pointerdown', onPointerDown);
      dom.removeEventListener('pointermove', onPointerMove);
      dom.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('pointercancel', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
    };
  }, [gl, invalidate]);

  useFrame((_, delta) => {
    if (!railGroupRef.current) return;

    // Decay dragOffset when not actively dragging
    if (!isDragging.current && Math.abs(dragOffset.current) > 0.0005) {
      dragOffset.current = THREE.MathUtils.lerp(
        dragOffset.current,
        0,
        Math.min(1.0, delta * REFERENCE_TOKENS.rail.snapSpeed),
      );
    }

    // Target rail position: active garment centered at x = 0 + user drag offset
    targetRailX.current = -activeGarmentIndex * GARMENT_SPACING + dragOffset.current;

    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;

    // Route-aware and ViewMode-aware camera positions
    if (routeFocus === 'product') {
      targetCamZ.current = isDesktop ? 3.15 : 3.4;
      targetCamY.current = isDesktop ? 0.08 : 0.25;
      targetCamX.current = isDesktop ? 0.72 : 0;
    } else if (routeFocus === 'collections') {
      targetCamZ.current = 5.2;
      targetCamY.current = 0.25;
      targetCamX.current = 0;
    } else if (viewMode === 'focus') {
      // Focus mode: Camera zooms in closer to active garment
      targetCamZ.current = isDesktop ? REFERENCE_TOKENS.focus.cameraZ : 3.55;
      targetCamY.current = REFERENCE_TOKENS.focus.cameraY;
      targetCamX.current = 0;
    } else {
      // Default rail mode
      targetCamZ.current = REFERENCE_TOKENS.camera.defaultZ;
      targetCamY.current = REFERENCE_TOKENS.camera.defaultY;
      targetCamX.current = REFERENCE_TOKENS.camera.defaultX;
    }

    const lerpSpeed = reducedMotion ? 1.0 : Math.min(1.0, delta * 5.8);

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
