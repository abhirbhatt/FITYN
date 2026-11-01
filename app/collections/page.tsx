import React from 'react';
import Link from 'next/link';
import { COLLECTIONS } from '@/data/collections';
import { SiteHeader } from '@/components/ui/SiteHeader';

export default function CollectionsPage() {
  return (
    <main className="flex min-h-screen flex-col justify-between p-6 md:p-12">
      <SiteHeader backHref="/" backLabel="&larr; Home" />

      <section className="my-12">
        <div className="mb-10">
          <span className="font-accent text-lg text-olive">Curated Archives</span>
          <h1 className="font-display text-h1 uppercase text-black tracking-display">
            COLLECTIONS
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLLECTIONS.map((col) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="group bg-bg-2 border border-line p-8 flex flex-col justify-between hover:border-black transition-colors min-h-[300px]"
            >
              <div>
                <span className="font-sans text-xs uppercase tracking-caption text-black/60 block mb-2">
                  {col.productIds.length} Garments
                </span>
                <h2 className="font-display text-2xl uppercase tracking-display text-black group-hover:text-olive transition-colors">
                  {col.name}
                </h2>
                <p className="font-sans text-sm text-black/70 mt-4 leading-relaxed">
                  {col.subtitle}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-line flex items-center justify-between">
                <span className="text-xs uppercase tracking-caption text-black font-semibold">
                  Explore Capsule
                </span>
                <span className="font-display text-base text-black group-hover:translate-x-1 transition-transform">
                  &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-line pt-4 text-xs uppercase tracking-caption text-black/60 flex justify-between">
        <span>FITYN &bull; Wear the Calm</span>
        <span>Route: /collections</span>
      </footer>
    </main>
  );
}
