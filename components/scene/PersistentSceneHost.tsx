'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useSearchParams } from 'next/navigation';
import { PRODUCTS } from '@/data/products';
import { useSceneStore } from '@/store/useSceneStore';
import { useQualityStore, QualityTier } from '@/store/useQualityStore';
import { SceneFallback } from './SceneFallback';
import { GarmentControls } from './GarmentControls';

// Dynamically import SceneCanvas strictly on client when WebGL and tier are supported
const DynamicSceneCanvas = dynamic(
  () => import('@/components/three/SceneCanvas'),
  {
    ssr: false,
    loading: () => <div className="w-full h-full bg-transparent" />,
  },
);

export function PersistentSceneRoot() {
  return (
    <React.Suspense
      fallback={
        <div
          id="persistent-canvas-root"
          aria-hidden="true"
          className="fixed inset-0 z-0 pointer-events-none"
        />
      }
    >
      <PersistentSceneHost />
    </React.Suspense>
  );
}

export function PersistentSceneHost() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { tier, is3DSupported, setTier, setReducedMotion } = useQualityStore();
  const { setRouteFocus, setActiveGarment } = useSceneStore();

  const [hasCheckedWebGL, setHasCheckedWebGL] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState(true);

  // 1. Tier override from URL (?tier=high|medium|low) & WebGL capability check
  useEffect(() => {
    // Check URL override
    const tierParam = searchParams.get('tier');
    if (tierParam === 'high' || tierParam === 'medium' || tierParam === 'low') {
      setTier(tierParam as QualityTier);
    }

    // Check prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    motionQuery.addEventListener('change', handleMotionChange);

    // Verify basic WebGL support
    try {
      const testCanvas = document.createElement('canvas');
      const gl =
        testCanvas.getContext('webgl2') ||
        testCanvas.getContext('webgl') ||
        testCanvas.getContext('experimental-webgl');
      setWebglAvailable(!!gl);
    } catch {
      setWebglAvailable(false);
    }

    setHasCheckedWebGL(true);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, [searchParams, setTier, setReducedMotion]);

  // 2. Synchronize Route with Scene Director & Focus
  useEffect(() => {
    if (pathname === '/') {
      setRouteFocus('rail');
    } else if (pathname.startsWith('/product/')) {
      setRouteFocus('product');
      // If navigating to /product/[slug], select the matching product
      const slug = pathname.replace('/product/', '');
      const foundIdx = PRODUCTS.findIndex((p) => p.slug === slug);
      if (foundIdx > -1) {
        setActiveGarment(foundIdx, PRODUCTS[foundIdx].id);
      }
    } else if (pathname.startsWith('/collections')) {
      setRouteFocus('collections');
    } else if (pathname === '/cart') {
      setRouteFocus('cart');
    } else {
      setRouteFocus('idle');
    }
  }, [pathname, setRouteFocus, setActiveGarment]);

  const canRender3D =
    hasCheckedWebGL &&
    webglAvailable &&
    is3DSupported &&
    tier !== 'low';

  // Do not render canvas or fallback on checkout/dev pages to conserve memory
  const isExcludedRoute =
    pathname.startsWith('/checkout') || pathname.startsWith('/dev');

  return (
    <>
      <div
        id="persistent-canvas-root"
        aria-hidden="true"
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${isExcludedRoute ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
          }`}
      >
        {canRender3D ? <DynamicSceneCanvas /> : <SceneFallback />}
      </div>

      {/* Synchronized DOM Keyboard & Touch Interaction Layer */}
      <GarmentControls />
    </>
  );
}