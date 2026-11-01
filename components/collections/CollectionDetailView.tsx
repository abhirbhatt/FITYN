'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { COLLECTIONS } from '@/data/collections';
import { PRODUCTS } from '@/data/products';
import { SiteHeader } from '@/components/ui/SiteHeader';

interface CollectionDetailViewProps {
  slug: string;
}

export function CollectionDetailView({ slug }: CollectionDetailViewProps) {
  const collection = COLLECTIONS.find((c) => c.slug === slug);

  const formattedTitle = collection
    ? collection.name.toUpperCase()
    : slug
      ? slug
        .split('-')
        .map((word) => word.toUpperCase())
        .join(' ')
      : 'COLLECTION';

  const collectionProducts = collection
    ? PRODUCTS.filter((p) => p.collectionIds.includes(collection.id))
    : PRODUCTS.slice(0, 3);

  return (
    <main className="flex min-h-screen flex-col justify-between p-6 md:p-12">
      <SiteHeader backHref="/collections" backLabel="&larr; All Collections" />

      <section className="my-12">
        <div className="mb-10">
          <span className="font-accent text-lg text-olive">Capsule Drop</span>
          <h1 className="font-display text-h1 uppercase text-black tracking-display">
            {formattedTitle}
          </h1>
          <p className="font-sans text-sm text-black/70 mt-2 max-w-xl">
            {collection?.description ??
              'Editorial capsule series engineered for tactile durability and calm aesthetics.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {collectionProducts.map((prod) => {
            const variant = prod.variants[0];
            const priceFormatted = `₹${(prod.price / 100).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
            })}`;

            return (
              <div
                key={prod.id}
                className="bg-bg-2 border border-line p-6 flex flex-col justify-between"
              >
                <div className="aspect-[3/4] bg-bg border border-line flex items-center justify-center mb-4 relative overflow-hidden">
                  {variant ? (
                    <div className="relative w-full h-full p-4 flex items-center justify-center">
                      <Image
                        src={variant.frontTexture}
                        alt={`${prod.name} Preview`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span className="font-display text-sm uppercase tracking-display text-black/50">
                      {prod.name}
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-accent text-xs text-olive">
                    {prod.subtitle}
                  </span>
                  <h3 className="font-display text-lg uppercase tracking-display text-black mt-1">
                    {prod.name}
                  </h3>
                  <p className="font-sans text-sm font-medium text-black mt-1">
                    {priceFormatted}
                  </p>
                </div>
                <Link
                  href={`/product/${prod.slug}`}
                  className="mt-4 min-h-touch inline-flex items-center justify-center bg-black text-offwhite font-display text-xs uppercase tracking-display hover:opacity-90 transition-opacity"
                >
                  VIEW GARMENT
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-line pt-4 text-xs uppercase tracking-caption text-black/60 flex justify-between">
        <span>FITYN &bull; Wear the Calm</span>
        <span>Route: /collections/{slug}</span>
      </footer>
    </main>
  );
}
