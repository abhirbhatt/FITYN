'use client';

import React from 'react';

export function SceneLighting() {
  return (
    <>
      {/* Studio Ambient Illumination */}
      <ambientLight intensity={1.1} color="#F3F3F0" />

      {/* Directional Key Light */}
      <directionalLight
        position={[2.5, 5, 4]}
        intensity={0.8}
        color="#FFFFFF"
      />

      {/* Subtle Fill Light */}
      <directionalLight
        position={[-3, 2, 3]}
        intensity={0.4}
        color="#E9E9E4"
      />
    </>
  );
}

