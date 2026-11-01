'use client';

import React, { useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { PRODUCTS } from '@/data/products';
import { useSceneStore } from '@/store/useSceneStore';

export function GarmentControls() {
  const router = useRouter();
  const pathname = usePathname();

  const {
    activeGarmentIndex,
    side,
    colourwayIndex,
    nextGarment,
    prevGarment,
    toggleSide,
    setColourway,
  } = useSceneStore();

  const activeProduct = PRODUCTS[activeGarmentIndex] ?? PRODUCTS[0];
  const activeVariant =
    activeProduct.variants[colourwayIndex % activeProduct.variants.length];

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextGarment();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevGarment();
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleSide();
      } else if (e.key === 'Enter' && pathname === '/') {
        e.preventDefault();
        router.push(`/product/${activeProduct.slug}`);
      }
    },
    [nextGarment, prevGarment, toggleSide, activeProduct, pathname, router],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Only render prominent rail controls on the home rail route
  const isRailVisible = pathname === '/';

  if (!isRailVisible) {
    return null;
  }

  return (
    <>
      {/* Top / Invisible ARIA Live Region for Assistive Tech */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        Active garment: {activeProduct.name}, Colour: {activeVariant.colourName}, Viewing: {side} side.
      </div>

      {/* Center Left/Right Arrow Navigation (Fixed & Viewport-Centered) */}
      <div className="fixed top-1/2 -translate-y-1/2 left-4 right-4 sm:left-8 sm:right-8 z-20 flex items-center justify-between pointer-events-none">
        <button
          type="button"
          onClick={prevGarment}
          aria-label="Previous garment"
          className="pointer-events-auto min-h-touch min-w-touch w-11 h-11 rounded-full bg-white/95 border border-line flex items-center justify-center font-display text-base text-black shadow-md hover:border-black hover:bg-white transition-colors"
        >
          &larr;
        </button>

        <button
          type="button"
          onClick={nextGarment}
          aria-label="Next garment"
          className="pointer-events-auto min-h-touch min-w-touch w-11 h-11 rounded-full bg-white/95 border border-line flex items-center justify-center font-display text-base text-black shadow-md hover:border-black hover:bg-white transition-colors"
        >
          &rarr;
        </button>
      </div>

      {/* Bottom Floating Rail Interactive Bar (Fixed above Marquee Bar) */}
      <div className="pointer-events-auto fixed bottom-14 sm:bottom-18 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 max-w-2xl z-20 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/95 backdrop-blur-md border border-line p-3 sm:px-6 shadow-lg">
        {/* Active Product Info */}
        <div className="flex items-center gap-3 text-center sm:text-left">
          <span className="font-mono text-xs text-black/50">
            0{activeGarmentIndex + 1} / 0{PRODUCTS.length}
          </span>
          <div>
            <h2 className="font-display text-sm uppercase tracking-display text-black">
              {activeProduct.name}
            </h2>
            <span className="font-sans text-[11px] text-black/60 block">
              {activeVariant.colourName} &bull; &#8377;
              {(activeProduct.price / 100).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        {/* Controls: Flip Side & Colourway Toggle */}
        <div className="flex items-center gap-3">
          {/* Front / Back Toggle */}
          <div className="flex items-center border border-line bg-bg-2 p-0.5">
            <button
              type="button"
              onClick={toggleSide}
              className={`min-h-[34px] px-3 font-display text-[11px] uppercase tracking-display transition-colors ${
                side === 'front'
                  ? 'bg-black text-offwhite'
                  : 'text-black hover:text-olive'
              }`}
            >
              FRONT
            </button>
            <button
              type="button"
              onClick={toggleSide}
              className={`min-h-[34px] px-3 font-display text-[11px] uppercase tracking-display transition-colors ${
                side === 'back'
                  ? 'bg-black text-offwhite'
                  : 'text-black hover:text-olive'
              }`}
            >
              BACK
            </button>
          </div>

          {/* Colourway Swatches */}
          <div className="flex items-center gap-1.5 border-l border-line pl-3">
            {activeProduct.variants.map((v, vIdx) => {
              const isSelected =
                colourwayIndex % activeProduct.variants.length === vIdx;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setColourway(vIdx)}
                  aria-label={`Select ${v.colourName}`}
                  className={`w-6 h-6 rounded-full border transition-all ${
                    isSelected
                      ? 'border-black scale-110 ring-2 ring-olive/40'
                      : 'border-line hover:border-black'
                  }`}
                  style={{ backgroundColor: v.colourHex }}
                />
              );
            })}
          </div>

          {/* Link to Product Detail */}
          <Link
            href={`/product/${activeProduct.slug}`}
            className="min-h-[34px] bg-olive text-offwhite px-4 flex items-center font-display text-[11px] uppercase tracking-display hover:opacity-90 transition-opacity ml-1"
          >
            SEE AVAILABILITY &nearr;
          </Link>
        </div>
      </div>
    </>
  );
}
