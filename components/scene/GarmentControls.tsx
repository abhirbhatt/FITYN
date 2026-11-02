'use client';

import React, { useEffect, useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { PRODUCTS } from '@/data/products';
import { useSceneStore } from '@/store/useSceneStore';

export function GarmentControls() {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  const {
    activeGarmentIndex,
    side,
    garmentColourways,
    viewMode,
    nextGarment,
    prevGarment,
    toggleSide,
    setColourway,
    enterFocus,
    exitFocus,
  } = useSceneStore();

  const isFocusMode = viewMode === 'focus';
  const activeProduct = PRODUCTS[activeGarmentIndex] ?? PRODUCTS[0];
  const activeColourwayIdx = garmentColourways[activeGarmentIndex] ?? 0;
  const activeVariant =
    activeProduct.variants[activeColourwayIdx % activeProduct.variants.length];

  // Scroll listener to hide rail controls when user scrolls down to browse catalog
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 140;
      setIsScrolledPastHero(scrolled);
      if (scrolled && isFocusMode) {
        exitFocus();
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFocusMode, exitFocus]);

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

      if (e.key === 'Escape') {
        if (isFocusMode) {
          e.preventDefault();
          exitFocus();
        }
      } else if (e.key === 'ArrowRight') {
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
        if (!isFocusMode) {
          enterFocus();
        } else {
          router.push(`/product/${activeProduct.slug}`);
        }
      }
    },
    [
      isFocusMode,
      exitFocus,
      enterFocus,
      nextGarment,
      prevGarment,
      toggleSide,
      activeProduct,
      pathname,
      router,
    ],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Only render rail controls on the home rail route
  const isRailVisible = pathname === '/';

  if (!isRailVisible) {
    return null;
  }

  return (
    <>
      {/* Invisible ARIA Live Region for Assistive Tech */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        Active garment: {activeProduct.name}, Colour: {activeVariant.colourName}, Viewing: {side} side, Mode: {viewMode}.
      </div>

      {/* Focus Mode Backdrop (Clicking backdrop exits focus mode) */}
      {isFocusMode && !isScrolledPastHero && (
        <div
          onClick={exitFocus}
          className="fixed inset-0 z-10 cursor-zoom-out bg-black/5 backdrop-blur-[1px] transition-all"
          aria-label="Click background to exit focused inspection view"
        />
      )}

      {/* Sleek Minimalist Side Arrow Navigation (Rail Mode) */}
      {!isFocusMode && (
        <div
          className={`fixed top-1/2 -translate-y-1/2 left-3 right-3 sm:left-6 sm:right-6 z-20 flex items-center justify-between pointer-events-none select-none transition-opacity duration-300 ${
            isScrolledPastHero ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <button
            type="button"
            onClick={prevGarment}
            aria-label="Previous garment"
            className="pointer-events-auto w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-black/10 flex items-center justify-center font-display text-sm text-black shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            &larr;
          </button>

          <button
            type="button"
            onClick={nextGarment}
            aria-label="Next garment"
            className="pointer-events-auto w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-black/10 flex items-center justify-center font-display text-sm text-black shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            &rarr;
          </button>
        </div>
      )}

      {/* Exit Focus Mode Pill Button (Top Left / Right) */}
      {isFocusMode && !isScrolledPastHero && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto select-none transition-opacity duration-300">
          <button
            type="button"
            onClick={exitFocus}
            className="rounded-full bg-white/90 hover:bg-black hover:text-white border border-black/15 px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider text-black shadow-sm flex items-center gap-1.5 transition-all"
          >
            <span>&times;</span>
            <span>BACK TO ARCHIVE RAIL</span>
            <span className="text-[9px] text-black/50 ml-1">(ESC)</span>
          </button>
        </div>
      )}

      {/* Controls Stage: Adapts between Rail Mode and Focused Inspection Mode */}
      <div
        className={`fixed bottom-14 sm:bottom-16 left-0 right-0 z-20 flex flex-col items-center justify-center gap-2 px-4 select-none transition-all duration-500 ${
          isScrolledPastHero ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        {!isFocusMode ? (
          /* =========================================================================
             RAIL MODE: Clean minimal caption & "SEE AVAILABILITY" pill (Reference 0-5s)
             ========================================================================= */
          <div className="text-center pointer-events-auto flex flex-col items-center gap-2">
            <div
              onClick={enterFocus}
              className="cursor-pointer group flex flex-col items-center"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-black/50 block mb-0.5">
                0{activeGarmentIndex + 1} / 0{PRODUCTS.length} &bull; {activeVariant.colourName}
              </span>
              <h2 className="font-display text-lg sm:text-xl uppercase tracking-display text-black group-hover:text-olive transition-colors">
                {activeProduct.name} &mdash; {activeVariant.colourName}
              </h2>
            </div>

            {/* SEE AVAILABILITY Pill Button */}
            <div className="flex items-center gap-2 mt-1">
              <Link
                href={`/product/${activeProduct.slug}`}
                className="rounded-full bg-white/90 hover:bg-olive hover:text-white border border-black/20 text-black px-5 py-2 font-display text-[11px] uppercase tracking-display shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
              >
                <span>SEE AVAILABILITY</span>
                <span>&nearr;</span>
              </Link>
            </div>
          </div>
        ) : (
          /* =========================================================================
             FOCUS MODE: Heavy uppercase sans title, Front/Back toggle, Colourway tags (Reference 5-12s)
             ========================================================================= */
          <div className="text-center pointer-events-auto flex flex-col items-center gap-2.5 max-w-lg">
            {/* Bold Centered Title */}
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-olive block mb-1">
                FOCUSED INSPECTION &bull; 0{activeGarmentIndex + 1}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-display text-black">
                {activeProduct.name}
              </h2>
              <span className="font-sans text-xs text-black/70 font-medium block mt-0.5">
                {activeVariant.colourName} &bull; &#8377;
                {(activeProduct.price / 100).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            {/* Segmented Front/Back Toggle & Colour Swatches Row */}
            <div className="flex items-center gap-2.5 flex-wrap justify-center mt-1">
              {/* Front / Back Segmented Pill */}
              <div className="flex items-center rounded-full border border-black/15 bg-white/90 backdrop-blur-sm p-0.5 shadow-sm">
                <button
                  type="button"
                  onClick={() => side !== 'front' && toggleSide()}
                  className={`px-3.5 py-1 rounded-full font-display text-[10px] uppercase tracking-wider transition-all ${
                    side === 'front'
                      ? 'bg-black text-white shadow-sm'
                      : 'text-black/70 hover:text-black'
                  }`}
                >
                  FRONT
                </button>
                <button
                  type="button"
                  onClick={() => side !== 'back' && toggleSide()}
                  className={`px-3.5 py-1 rounded-full font-display text-[10px] uppercase tracking-wider transition-all ${
                    side === 'back'
                      ? 'bg-black text-white shadow-sm'
                      : 'text-black/70 hover:text-black'
                  }`}
                >
                  BACK
                </button>
              </div>

              {/* Colourway Swatches Pill */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/15 bg-white/90 backdrop-blur-sm shadow-sm">
                {activeProduct.variants.map((v, vIdx) => {
                  const isSelected = activeColourwayIdx === vIdx;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setColourway(vIdx)}
                      aria-label={`Select ${v.colourName}`}
                      className={`w-4 h-4 rounded-full border transition-all ${
                        isSelected
                          ? 'border-black scale-110 ring-2 ring-olive/50'
                          : 'border-black/20 hover:border-black'
                      }`}
                      style={{ backgroundColor: v.colourHex }}
                    />
                  );
                })}
              </div>

              {/* SEE AVAILABILITY ↗ Direct Link to Product Detail Page */}
              <Link
                href={`/product/${activeProduct.slug}`}
                className="rounded-full bg-olive text-white px-5 py-1.5 font-display text-[11px] uppercase tracking-display hover:bg-black transition-all shadow-sm flex items-center gap-1 active:scale-95"
              >
                <span>SEE AVAILABILITY</span>
                <span>&nearr;</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
