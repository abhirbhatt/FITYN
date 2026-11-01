import React from 'react';
import { SiteHeader } from '@/components/ui/SiteHeader';

export default function HomePage() {
  return (
    <main className="pointer-events-none flex min-h-screen flex-col justify-between p-6 md:p-12 pb-24 relative overflow-hidden">
      {/* Editorial Header */}
      <SiteHeader />

      {/* Subdued Editorial Eyebrow */}
      <div className="pointer-events-none mt-2 text-center">
        <span className="font-accent text-sm md:text-base text-olive tracking-wide select-none">
          Signature Interactive Rail &bull; Capsule 01
        </span>
      </div>

      {/* Spacious Middle Area reserved for 3D Rail Garments */}
      <div className="flex-1 min-h-[350px] md:min-h-[480px]" />

      {/* Fixed Bottom Marquee Bar */}
      <footer className="pointer-events-auto fixed bottom-0 left-0 right-0 z-30 bg-olive py-3 px-4 overflow-hidden border-t border-olive/30 select-none">
        <div className="flex items-center justify-center whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
          <p className="font-display text-xs md:text-sm uppercase tracking-display text-offwhite">
            NEW DROPS &bull; FITYN &bull; WEAR THE CALM &bull; LIMITED RUN &bull; ALL COTTON HEAVYWEIGHT &bull; TACTILE DIGITAL APPAREL &bull; NEW DROPS &bull; FITYN &bull; WEAR THE CALM
          </p>
        </div>
      </footer>
    </main>
  );
}
