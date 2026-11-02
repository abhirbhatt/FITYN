import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SiteHeader } from '@/components/ui/SiteHeader';
import { PRODUCTS } from '@/data/products';
import { COLLECTIONS } from '@/data/collections';

export default function HomePage() {
  return (
      <div className="relative flex flex-col min-h-screen">
        {/* =========================================================================
          HERO STAGE: Interactive 3D Hanging Garment Rail
          ========================================================================= */}
        <section className="relative min-h-screen flex flex-col justify-between p-6 md:p-12 pb-28">
          {/* Editorial Site Header */}
          <SiteHeader />

          {/* Subdued Editorial Eyebrow */}
          <div className="pointer-events-none mt-2 text-center select-none">
            <span className="font-accent text-sm md:text-base text-olive tracking-wide">
              Signature Interactive Rail &bull; Capsule 01
            </span>
          </div>

          {/* Spacious Middle Area reserved for 3D Rail Garments */}
          <div className="flex-1 min-h-[380px] md:min-h-[500px]" />

            {/* Minimalist Scroll Hint */}
            <div className="pointer-events-auto flex items-center justify-center select-none pt-4">
              <a
                href="#collections-section"
                className="font-mono text-[11px] uppercase tracking-widest text-black/40 hover:text-olive transition-colors flex items-center gap-1.5"
              >
                <span>SCROLL TO EXPLORE ARCHIVE</span>
                <span>&darr;</span>
              </a>
            </div>
        </section>

        {/* =========================================================================
          SECTION 01: Curated Drops / Collections (Fully Working CTAs)
          ========================================================================= */}
        <section
          id="collections-section"
          className="pointer-events-auto relative z-10 bg-bg border-t border-line pt-20 pb-20 px-6 md:px-12"
        >
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-line pb-6 gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-olive block mb-2">
                  01 / CURATED CAPSULES
                </span>
                <h2 className="font-display text-3xl md:text-5xl uppercase tracking-display text-black">
                  ARCHITECTURAL DROPS
                </h2>
              </div>
              <p className="font-sans text-sm text-black/70 max-w-md">
                Each capsule is engineered around specific fabric weights, custom
                enzyme treatments, and minimalist silhouettes.
              </p>
            </div>

            {/* 3 Curated Collection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {COLLECTIONS.map((col, idx) => (
                <div
                  key={col.id}
                  className="group border border-line bg-white/70 backdrop-blur-sm p-6 flex flex-col justify-between hover:border-black transition-all hover:shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-xs text-black/50 mb-6">
                      <span>CAPSULE 0{idx + 1}</span>
                      <span>{col.productIds.length} PIECES</span>
                    </div>
                    <h3 className="font-display text-xl uppercase tracking-display text-black mb-2 group-hover:text-olive transition-colors">
                      {col.name}
                    </h3>
                    <p className="font-sans text-xs text-black/70 line-clamp-3 mb-8">
                      {col.description}
                    </p>
                  </div>

                  <Link
                    href={`/collections/${col.slug}`}
                    className="min-h-touch inline-flex items-center justify-between border border-line px-4 py-2.5 font-display text-xs uppercase tracking-display text-black group-hover:border-black group-hover:bg-black group-hover:text-offwhite transition-colors"
                  >
                    <span>EXPLORE CAPSULE</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
          SECTION 02: Full Garment Archive (All 7 Pieces with Working CTAs)
          ========================================================================= */}
        <section className="pointer-events-auto relative z-10 bg-bg border-t border-line pt-20 pb-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-line pb-6 gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-olive block mb-2">
                  02 / COMPLETE ROSTER
                </span>
                <h2 className="font-display text-3xl md:text-5xl uppercase tracking-display text-black">
                  THE 7 ARCHETYPES
                </h2>
              </div>
              <span className="font-mono text-xs text-black/50">
                CAPSULE 01 &bull; ALL LIMITED DROP RUNS
              </span>
            </div>

            {/* 7 Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {PRODUCTS.map((product) => {
                const primaryVariant = product.variants[0];
                const priceFormatted = (product.price / 100).toLocaleString(
                  'en-IN',
                  {
                    minimumFractionDigits: 2,
                  },
                );

                return (
                  <div
                    key={product.id}
                    className="group border border-line bg-white/70 backdrop-blur-sm p-5 flex flex-col justify-between hover:border-black transition-all hover:shadow-sm"
                  >
                    {/* Top Bar: Subtitle & Archetype */}
                    <div>
                      <div className="flex items-center justify-between font-mono text-[11px] text-black/50 mb-3">
                        <span className="uppercase tracking-wider">
                          {product.archetype.replace('-', ' ')}
                        </span>
                        <span className="text-olive font-medium">IN STOCK</span>
                      </div>

                      {/* Garment Image Stage */}
                      <Link
                        href={`/product/${product.slug}`}
                        className="block relative w-full aspect-square bg-bg-2 overflow-hidden mb-4 group-hover:opacity-95 transition-opacity"
                      >
                        <Image
                          src={primaryVariant.frontTexture}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          unoptimized
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      {/* Product Metadata */}
                      <div className="mb-4">
                        <h3 className="font-display text-base uppercase tracking-display text-black group-hover:text-olive transition-colors">
                          {product.name}
                        </h3>
                        <p className="font-sans text-xs text-black/60 line-clamp-1 mb-2">
                          {product.subtitle}
                        </p>

                        {/* Swatch dots preview */}
                        <div className="flex items-center gap-1.5 mb-3">
                          {product.variants.map((v) => (
                            <span
                              key={v.id}
                              className="w-3.5 h-3.5 rounded-full border border-black/20"
                              style={{ backgroundColor: v.colourHex }}
                              title={v.colourName}
                            />
                          ))}
                        </div>

                        {/* Price */}
                        <span className="font-mono text-sm font-semibold text-black block">
                          &#8377;{priceFormatted}
                        </span>
                      </div>
                    </div>

                    {/* Working CTA */}
                    <Link
                      href={`/product/${product.slug}`}
                      className="min-h-touch inline-flex items-center justify-between bg-black text-offwhite px-4 py-2.5 font-display text-xs uppercase tracking-display hover:bg-olive transition-colors w-full"
                    >
                      <span>VIEW PIECE</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
          SECTION 03: Craft & Material Philosophy
          ========================================================================= */}
        <section className="pointer-events-auto relative z-10 bg-bg-2 border-t border-line py-20 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="mb-12 border-b border-line pb-6">
              <span className="font-mono text-xs uppercase tracking-widest text-olive block mb-2">
                03 / PHILOSOPHY & CRAFT
              </span>
              <h2 className="font-display text-3xl md:text-5xl uppercase tracking-display text-black">
                THE FITYN STANDARD
              </h2>
            </div>

            {/* 4 Architectural Standards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="border border-line bg-white/70 p-6">
                <span className="font-display text-2xl text-olive mb-2 block">
                  240–420 GSM
                </span>
                <h3 className="font-display text-sm uppercase tracking-display text-black mb-2">
                  Heavyweight Knits
                </h3>
                <p className="font-sans text-xs text-black/70 leading-relaxed">
                  Substantial combed organic cottons cut with architectural drops
                  to hold silhouette without body cling.
                </p>
              </div>

              <div className="border border-line bg-white/70 p-6">
                <span className="font-display text-2xl text-olive mb-2 block">
                  CUSTOM ENZYME
                </span>
                <h3 className="font-display text-sm uppercase tracking-display text-black mb-2">
                  Patina Washes
                </h3>
                <p className="font-sans text-xs text-black/70 leading-relaxed">
                  Hand-dipped pigment finishes ensuring pre-shrunk dimensional
                  stability and rich muted tonal depth.
                </p>
              </div>

              <div className="border border-line bg-white/70 p-6">
                <span className="font-display text-2xl text-olive mb-2 block">
                  MINIMAL HARDWARE
                </span>
                <h3 className="font-display text-sm uppercase tracking-display text-black mb-2">
                  Tactile Detailing
                </h3>
                <p className="font-sans text-xs text-black/70 leading-relaxed">
                  Concealed YKK metal closures, tactile back framing, and subtle
                  micro-insignia across all seams.
                </p>
              </div>

              <div className="border border-line bg-white/70 p-6">
                <span className="font-display text-2xl text-olive mb-2 block">
                  48H DISPATCH
                </span>
                <h3 className="font-display text-sm uppercase tracking-display text-black mb-2">
                  Curated Packaging
                </h3>
                <p className="font-sans text-xs text-black/70 leading-relaxed">
                  Inspected, wrapped in custom biodegradable tissue, and shipped
                  from Bengaluru via Express Courier.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
          SECTION 04: Brand Call To Action Banner (CTA Proof)
          ========================================================================= */}
        <section className="pointer-events-auto relative z-10 bg-bg px-6 md:px-12 py-12">
          <div className="max-w-7xl mx-auto bg-olive text-offwhite p-8 md:p-14 border border-olive/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 select-none">
            <div className="max-w-xl">
              <span className="font-accent text-lg text-offwhite/90 block mb-1">
                Wear the Calm
              </span>
              <h2 className="font-display text-3xl md:text-5xl uppercase tracking-display mb-3">
                SCULPTURAL COMFORT FOR URBAN STILLNESS
              </h2>
              <p className="font-sans text-xs md:text-sm text-offwhite/80 leading-relaxed">
                Explore all seven signature archetypes designed for quiet presence
                and daily versatility.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                href="/collections"
                className="min-h-touch inline-flex items-center justify-center bg-offwhite text-black px-6 py-3 font-display text-xs uppercase tracking-display hover:bg-white transition-colors"
              >
                BROWSE ALL COLLECTIONS &rarr;
              </Link>
              <Link
                href="/cart"
                className="min-h-touch inline-flex items-center justify-center border border-offwhite/40 text-offwhite px-6 py-3 font-display text-xs uppercase tracking-display hover:border-offwhite transition-colors"
              >
                VIEW SHOPPING CART
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
          STORE FOOTER
          ========================================================================= */}
        <footer className="pointer-events-auto relative z-10 bg-bg border-t border-line py-12 px-6 md:px-12 pb-24 text-xs select-none">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="font-display text-xl uppercase tracking-display text-black"
              >
                FITYN
              </Link>
              <span className="text-black/50">
                &copy; {new Date().getFullYear()} FITYN APPAREL. All rights reserved.
              </span>
            </div>

            <nav className="flex items-center gap-6 flex-wrap font-mono uppercase tracking-wider text-[11px] text-black/70">
              <Link href="/collections" className="hover:text-olive transition-colors">
                Collections
              </Link>
              <Link href="/cart" className="hover:text-olive transition-colors">
                Cart
              </Link>
              <Link href="/checkout" className="hover:text-olive transition-colors">
                Checkout
              </Link>
            </nav>
          </div>
        </footer>

        {/* =========================================================================
          FIXED BOTTOM MARQUEE BAR
          ========================================================================= */}
        <div
          className="pointer-events-auto fixed bottom-0 left-0 right-0 z-30 py-2.5 px-4 overflow-hidden border-t border-black/10 select-none"
          style={{ backgroundColor: 'var(--ticker-bg, #486C2F)', color: 'var(--ticker-text, #F3F3F0)' }}
        >
          <div className="flex items-center justify-center whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
            <p
              className="font-display text-xs md:text-sm uppercase tracking-display"
              style={{ color: 'var(--ticker-text, #F3F3F0)' }}
            >
              NEW DROPS &bull; FITYN &bull; WEAR THE CALM &bull; LIMITED RUN &bull;
              ALL COTTON HEAVYWEIGHT &bull; TACTILE DIGITAL APPAREL &bull; NEW
              DROPS &bull; FITYN &bull; WEAR THE CALM
            </p>
          </div>
        </div>
      </div>
  );
}
