'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useQualityStore } from '@/store/useQualityStore';
import { GarmentRail } from './GarmentRail';
import { SceneLighting } from './SceneLighting';

export default function SceneCanvas() {
  const { maxDpr, tier } = useQualityStore();
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn('WebGL context lost. Setting fallback state.');
      setContextLost(true);
    };

    const handleContextRestored = () => {
      console.log('WebGL context restored.');
      setContextLost(false);
    };

    const canvasEl = document.querySelector('#fityn-persistent-canvas canvas');
    if (canvasEl) {
      canvasEl.addEventListener('webglcontextlost', handleContextLost);
      canvasEl.addEventListener('webglcontextrestored', handleContextRestored);
    }

    return () => {
      if (canvasEl) {
        canvasEl.removeEventListener('webglcontextlost', handleContextLost);
        canvasEl.removeEventListener('webglcontextrestored', handleContextRestored);
      }
    };
  }, []);

  if (contextLost) {
    return null; // Triggers DOM fallback
  }

  return (
    <div id="fityn-persistent-canvas" className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0.05, 4.3], fov: 42 }}
        dpr={[1, maxDpr]}
        gl={{
          antialias: tier === 'high',
          alpha: true,
          powerPreference: 'high-performance',
          depth: true,
        }}
        frameloop="demand"
      >
        <SceneLighting />
        <Suspense fallback={null}>
          <GarmentRail />
        </Suspense>
      </Canvas>
    </div>
  );
}

