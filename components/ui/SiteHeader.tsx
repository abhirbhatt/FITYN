'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';

interface SiteHeaderProps {
  backHref?: string;
  backLabel?: string;
}

export function SiteHeader({ backHref, backLabel }: SiteHeaderProps) {
  const { items, hasHydrated, openCart } = useCartStore();

  const cartCount = hasHydrated
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  return (
    <header className="pointer-events-auto flex items-center justify-between border-b border-line pb-4">
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="font-display text-2xl uppercase tracking-display text-black min-h-touch min-w-touch flex items-center"
        >
          FITYN
        </Link>
        <span className="font-accent text-lg text-olive hidden sm:inline select-none">
          Wear the Calm
        </span>
      </div>

      <nav className="flex items-center gap-6">
        {backHref && backLabel ? (
          <Link
            href={backHref}
            className="text-xs uppercase tracking-caption text-black hover:text-olive transition-colors min-h-touch flex items-center"
          >
            {backLabel}
          </Link>
        ) : (
          <Link
            href="/collections"
            className="text-xs uppercase tracking-caption text-black hover:text-olive transition-colors min-h-touch flex items-center"
          >
            Collections
          </Link>
        )}

        <button
          type="button"
          onClick={openCart}
          aria-label={`Open shopping cart containing ${cartCount} items`}
          className="text-xs uppercase tracking-caption text-black hover:text-olive transition-colors min-h-touch flex items-center gap-1.5"
        >
          <span>Cart</span>
          <span
            className={`font-mono text-[11px] px-1.5 py-0.5 transition-colors ${
              cartCount > 0
                ? 'bg-olive text-offwhite font-bold'
                : 'bg-bg-2 text-black/60'
            }`}
          >
            {cartCount}
          </span>
        </button>

        <Link
          href="/dev/tokens"
          className="text-xs uppercase tracking-caption border border-line px-3 py-1.5 hover:border-black transition-colors min-h-touch flex items-center"
        >
          Tokens
        </Link>
      </nav>
    </header>
  );
}

