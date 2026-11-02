'use client';

import React from 'react';
import Image from 'next/image';
import { PRODUCTS } from '@/data/products';
import { useSceneStore } from '@/store/useSceneStore';

const ITEM_WIDTH = 292; // 260px width + 32px (mx-4) horizontal margin
const HALF_ITEM = 146;

export function SceneFallback() {
  const {
    activeGarmentIndex,
    side,
    garmentColourways,
    routeFocus,
    viewMode,
    setActiveGarment,
    enterFocus,
  } = useSceneStore();

  const isProductRoute = routeFocus === 'product';
  const isFocusMode = viewMode === 'focus';

  // In product view mode, render only the active garment in the dedicated product stage
  if (isProductRoute) {
    const prod = PRODUCTS[activeGarmentIndex] ?? PRODUCTS[0];
    const activeColourway = garmentColourways[activeGarmentIndex] ?? 0;
    const variant = prod.variants[activeColourway % prod.variants.length];
    const textureSrc = side === 'back' ? variant.backTexture : variant.frontTexture;

    return (
      <div className="w-full h-full relative overflow-hidden pointer-events-none select-none">
        {/* Subtle 2D Rail Metal Silhouette */}
        <div className="absolute top-[16%] lg:top-[18%] w-full h-[2px] bg-line z-0" />

        {/* Focused Active Garment Container */}
        <div className="absolute inset-0 flex items-center justify-center lg:justify-start lg:pl-[12vw] z-10">
          <div className="relative w-[280px] h-[360px] md:w-[320px] md:h-[420px] transition-transform duration-500">
            <Image
              src={textureSrc}
              alt={prod.name}
              fill
              sizes="320px"
              unoptimized
              className={`object-contain transition-transform duration-500 ${
                side === 'back' ? 'rotate-y-180' : ''
              }`}
              priority
            />
          </div>
        </div>
      </div>
    );
  }

  // In rail view mode (Homepage), render horizontal 7-garment interactive carousel
  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col items-center justify-center">
      {/* 2D Rail Metal Silhouette */}
      <div
        className={`absolute top-[26%] w-[120%] h-[2px] bg-line z-0 transition-opacity duration-500 ${
          isFocusMode ? 'opacity-20' : 'opacity-100'
        }`}
      />

      {/* Horizontal CSS Transform Rail Container */}
      <div
        className="flex items-center transition-transform duration-500 ease-out z-10"
        style={{
          transform: `translateX(calc(50vw - ${
            activeGarmentIndex * ITEM_WIDTH + HALF_ITEM
          }px))`,
        }}
      >
        {PRODUCTS.map((prod, idx) => {
          const isActive = idx === activeGarmentIndex;
          const prodColourway = garmentColourways[idx] ?? 0;
          const variant = prod.variants[prodColourway % prod.variants.length];
          const textureSrc =
            side === 'back' && isActive ? variant.backTexture : variant.frontTexture;

          return (
            <div
              key={prod.id}
              onClick={() => {
                if (isActive) {
                  if (!isFocusMode) enterFocus();
                } else {
                  setActiveGarment(idx, prod.id);
                }
              }}
              className={`flex-shrink-0 w-[260px] mx-4 flex flex-col items-center cursor-pointer transition-all duration-500 ${
                isActive
                  ? isFocusMode
                    ? 'scale-125 opacity-100 z-30'
                    : 'scale-105 opacity-100 z-20'
                  : isFocusMode
                  ? 'scale-80 opacity-25 filter blur-[3px] pointer-events-none z-10'
                  : 'scale-90 opacity-60 filter blur-[1px] hover:opacity-85 z-10'
              }`}
            >
              {/* Garment Image Quad in 2D */}
              <div className="relative w-[240px] h-[300px]">
                <Image
                  src={textureSrc}
                  alt={prod.name}
                  fill
                  sizes="260px"
                  unoptimized
                  className={`object-contain transition-transform duration-500 ${
                    side === 'back' && isActive ? 'rotate-y-180' : ''
                  }`}
                  priority={isActive}
                />
              </div>

              {/* Garment Label (shown only when not in focus mode) */}
              {!isFocusMode && (
                <div className="mt-3 text-center">
                  <span className="font-display text-xs uppercase tracking-display text-black">
                    {prod.name}
                  </span>
                  <span className="block font-sans text-[11px] text-black/60">
                    {variant.colourName}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
