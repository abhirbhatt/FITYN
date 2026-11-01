'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PRODUCTS } from '@/data/products';
import { useSceneStore } from '@/store/useSceneStore';
import { useCartStore } from '@/store/useCartStore';
import { SiteHeader } from '@/components/ui/SiteHeader';
import { GarmentSize } from '@/lib/types/commerce';

interface ProductDetailViewProps {
  slug: string;
}

export function ProductDetailView({ slug }: ProductDetailViewProps) {
  const router = useRouter();
  const product = PRODUCTS.find((p) => p.slug === slug);

  const {
    side,
    colourwayIndex,
    toggleSide,
    setColourway,
    setActiveGarment,
  } = useSceneStore();

  const { addItem, openCart } = useCartStore();

  const [selectedSize, setSelectedSize] = useState<GarmentSize>('M');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);

  // Sync active garment index and reset colourway when this product mounts
  useEffect(() => {
    if (product) {
      const idx = PRODUCTS.findIndex((p) => p.id === product.id);
      if (idx > -1) {
        setActiveGarment(idx, product.id);
      }
      setColourway(0);
    }
  }, [product, setActiveGarment, setColourway]);

  if (!product) {
    return (
      <main className="flex min-h-screen flex-col justify-between p-6 md:p-12">
        <SiteHeader />
        <div className="py-24 text-center max-w-md mx-auto">
          <span className="font-accent text-lg text-olive">Catalogue Error</span>
          <h1 className="font-display text-3xl uppercase tracking-display text-black mt-2 mb-4">
            GARMENT NOT FOUND
          </h1>
          <p className="font-sans text-sm text-black/70 mb-8">
            The requested apparel piece does not exist in the current collection.
          </p>
          <Link
            href="/"
            className="min-h-touch inline-flex items-center justify-center bg-olive text-offwhite px-8 py-3.5 font-display uppercase tracking-display"
          >
            RETURN TO RAIL
          </Link>
        </div>
        <footer className="border-t border-line pt-4 text-xs uppercase tracking-caption text-black/60">
          FITYN &bull; Wear the Calm
        </footer>
      </main>
    );
  }

  const activeVariant =
    product.variants[colourwayIndex % product.variants.length] ??
    product.variants[0];

  const priceFormatted = `₹${(product.price / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
  })}`;

  const currentSizeStock =
    activeVariant.sizes.find((s) => s.size === selectedSize)?.stock ?? 10;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: activeVariant.id,
      size: selectedSize,
      quantity,
    });
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
      openCart();
    }, 400);
  };

  const handleBuyNow = () => {
    addItem({
      productId: product.id,
      variantId: activeVariant.id,
      size: selectedSize,
      quantity,
    });
    router.push('/checkout');
  };

  return (
    <main className="flex min-h-screen flex-col justify-between p-6 md:p-12">
      {/* Header with Back Link */}
      <SiteHeader backHref="/" backLabel="&larr; Back to Rail" />

      {/* Main 2-Column Product Layout */}
      <section className="my-6 lg:my-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left Column: Transparent 3D Garment Showcase Stage */}
        <div className="relative aspect-[4/5] lg:aspect-auto lg:h-[580px] border border-line/60 flex flex-col justify-between p-5 pointer-events-none select-none">
          {/* Top Stage Badges */}
          <div className="flex items-center justify-between w-full pointer-events-auto">
            <span className="font-mono text-[11px] uppercase tracking-caption text-black/50 bg-white/80 backdrop-blur-xs px-2.5 py-1 border border-line/40">
              3D PHOTO-PLANE &bull; {side.toUpperCase()}
            </span>
            <span className="font-accent text-sm text-olive bg-white/80 backdrop-blur-xs px-2.5 py-1 border border-line/40">
              {activeVariant.colourName}
            </span>
          </div>

          {/* Center Stage: The 3D Canvas shines through this open transparent area */}
          <div className="flex-1 w-full flex items-center justify-center" />

          {/* Bottom Stage Interactive Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full pointer-events-auto">
            {/* Front / Back Toggle Pill */}
            <div className="flex items-center border border-line bg-white/95 backdrop-blur-xs p-1 shadow-xs">
              <button
                type="button"
                onClick={toggleSide}
                className={`min-h-[34px] px-4 font-display text-xs uppercase tracking-display transition-colors ${
                  side === 'front'
                    ? 'bg-black text-offwhite'
                    : 'text-black hover:text-olive'
                }`}
              >
                FRONT VIEW
              </button>
              <button
                type="button"
                onClick={toggleSide}
                className={`min-h-[34px] px-4 font-display text-xs uppercase tracking-display transition-colors ${
                  side === 'back'
                    ? 'bg-black text-offwhite'
                    : 'text-black hover:text-olive'
                }`}
              >
                BACK VIEW
              </button>
            </div>

            {/* Hint Tag */}
            <span className="font-sans text-[11px] uppercase tracking-caption text-black/50 bg-white/80 backdrop-blur-xs px-3 py-1.5 border border-line/40 hidden sm:inline">
              Press [F] to Flip &bull; Sway Active
            </span>
          </div>
        </div>

        {/* Right Column: Product Metadata, Customization & Actions */}
        <div className="flex flex-col space-y-6 bg-white/95 backdrop-blur-xs border border-line/80 p-6 md:p-8 shadow-xs">
          {/* Title & Price */}
          <div className="border-b border-line pb-4">
            <span className="font-accent text-base text-olive block mb-1">
              {product.subtitle}
            </span>
            <h1 className="font-display text-h2 uppercase text-black tracking-display">
              {product.name}
            </h1>
            <p className="font-sans text-2xl font-bold text-black mt-2">
              {priceFormatted}
            </p>
            <span className="font-sans text-xs text-black/60 block mt-1">
              Inclusive of all domestic taxes &bull; Free express delivery
            </span>
          </div>

          {/* Garment Description */}
          <p className="font-sans text-sm text-black/80 leading-relaxed">
            {product.description}
          </p>

          {/* Colourway Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-sans text-xs uppercase tracking-caption text-black/70 font-semibold">
                Colourway: <span className="text-black font-normal">{activeVariant.colourName}</span>
              </label>
              <span className="font-mono text-[11px] text-black/50">
                0{colourwayIndex % product.variants.length + 1} / 0{product.variants.length}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {product.variants.map((v, vIdx) => {
                const isSelected =
                  colourwayIndex % product.variants.length === vIdx;

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setColourway(vIdx)}
                    aria-label={`Select colour ${v.colourName}`}
                    className={`min-h-[38px] px-3 py-1.5 flex items-center gap-2 border transition-all ${
                      isSelected
                        ? 'border-black bg-bg-2 ring-1 ring-black'
                        : 'border-line hover:border-black/60 bg-white'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: v.colourHex }}
                    />
                    <span className="font-sans text-xs">{v.colourName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-sans text-xs uppercase tracking-caption text-black/70 font-semibold">
                Select Size
              </label>
              <span className="font-sans text-xs text-black/60">
                {currentSizeStock <= 5 ? (
                  <span className="text-amber-700 font-medium">
                    Only {currentSizeStock} remaining
                  </span>
                ) : (
                  'In Stock'
                )}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {activeVariant.sizes.map((s) => {
                const isSelected = selectedSize === s.size;
                const isOutOfStock = s.stock === 0;

                return (
                  <button
                    key={s.size}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => setSelectedSize(s.size)}
                    aria-label={`Select size ${s.size}`}
                    className={`min-h-[44px] min-w-[44px] w-11 h-11 flex items-center justify-center font-display text-sm tracking-display border transition-colors ${
                      isSelected
                        ? 'bg-black text-offwhite border-black'
                        : isOutOfStock
                        ? 'border-line/40 text-black/30 cursor-not-allowed bg-bg-2'
                        : 'border-line text-black hover:border-black bg-white'
                    }`}
                  >
                    {s.size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="font-sans text-xs uppercase tracking-caption text-black/70 font-semibold">
              Quantity
            </label>
            <div className="flex items-center border border-line w-32 bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="w-10 h-9 flex items-center justify-center font-display text-sm hover:bg-bg-2"
              >
                -
              </button>
              <span className="flex-1 text-center font-sans text-sm font-semibold">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((q) => Math.min(currentSizeStock, q + 1))
                }
                aria-label="Increase quantity"
                className="w-10 h-9 flex items-center justify-center font-display text-sm hover:bg-bg-2"
              >
                +
              </button>
            </div>
          </div>

          {/* Purchase Actions */}
          <div className="pt-3 flex flex-col sm:flex-row gap-3 border-t border-line">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`min-h-touch flex-1 px-8 py-3.5 font-display text-sm uppercase tracking-display transition-all flex items-center justify-center gap-2 ${
                addedFeedback
                  ? 'bg-black text-offwhite scale-[0.98]'
                  : 'bg-olive text-offwhite hover:opacity-95'
              }`}
            >
              {addedFeedback ? (
                <>
                  <span>&check;</span>
                  <span>ADDED TO BAG</span>
                </>
              ) : (
                <span>ADD TO CART</span>
              )}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="min-h-touch flex-1 bg-black text-offwhite px-8 py-3.5 font-display text-sm uppercase tracking-display hover:opacity-95 transition-opacity flex items-center justify-center"
            >
              BUY NOW
            </button>
          </div>

          {/* Craft Specifications Accordion / Disclosure */}
          <details className="border-t border-line pt-3 group select-none">
            <summary className="font-display text-xs uppercase tracking-display text-black cursor-pointer flex items-center justify-between hover:text-olive py-1">
              <span>CRAFT &amp; ARCHITECTURE</span>
              <span className="font-mono text-xs transition-transform group-open:rotate-45">+</span>
            </summary>
            <ul className="mt-2.5 space-y-1.5 font-sans text-xs text-black/75 list-disc list-inside">
              {product.details.map((detail, dIdx) => (
                <li key={dIdx}>{detail}</li>
              ))}
            </ul>
          </details>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line pt-4 text-xs uppercase tracking-caption text-black/60 flex justify-between">
        <span>FITYN &bull; Wear the Calm</span>
        <span>Route: /product/{slug}</span>
      </footer>
    </main>
  );
}
