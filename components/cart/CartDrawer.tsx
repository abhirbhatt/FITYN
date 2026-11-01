'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { PRODUCTS } from '@/data/products';

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    updateQuantity,
    removeItem,
    hasHydrated,
  } = useCartStore();

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCart]);

  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Resolve items against PRODUCTS catalog
  const resolvedItems = items.map((item) => {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    const variant = product?.variants.find((v) => v.id === item.variantId) ?? product?.variants[0];
    const unitPrice = product ? product.price : 0;
    const itemTotal = unitPrice * item.quantity;
    return {
      ...item,
      product,
      variant,
      unitPrice,
      itemTotal,
    };
  });

  const subtotal = resolvedItems.reduce((sum, item) => sum + item.itemTotal, 0);
  const formattedSubtotal = `₹${(subtotal / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
  })}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer Panel */}
      <aside className="relative z-10 w-full max-w-md bg-white border-l border-line flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-out">
        {/* Drawer Header */}
        <div className="p-6 border-b border-line flex items-center justify-between bg-bg">
          <div>
            <span className="font-accent text-sm text-olive">Your Selection</span>
            <h2 className="font-display text-xl uppercase tracking-display text-black">
              CART ({items.reduce((sum, i) => sum + i.quantity, 0)})
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="min-h-touch min-w-touch p-2 text-black hover:text-olive font-display text-xl flex items-center justify-center transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Drawer Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!hasHydrated ? (
            <div className="py-12 text-center text-sm text-black/60">
              Loading cart...
            </div>
          ) : resolvedItems.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-line p-8">
              <p className="font-sans text-sm text-black/70 mb-6">
                Your bag is currently empty.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="min-h-touch px-6 py-2.5 bg-olive text-offwhite font-display text-xs uppercase tracking-display hover:opacity-95 transition-opacity"
              >
                EXPLORE THE RAIL
              </button>
            </div>
          ) : (
            <div className="divide-y divide-line">
              {resolvedItems.map((item) => {
                const priceFormatted = `₹${(item.unitPrice / 100).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                })}`;

                return (
                  <div
                    key={`${item.productId}-${item.variantId}-${item.size}`}
                    className="py-4 flex gap-4 items-center"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-16 h-20 bg-bg-2 border border-line flex-shrink-0 flex items-center justify-center p-1">
                      {item.variant ? (
                        <Image
                          src={item.variant.frontTexture}
                          alt={item.product?.name ?? 'Garment'}
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                        />
                      ) : (
                        <span className="font-display text-xs">FITYN</span>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-sm uppercase tracking-display text-black truncate">
                        {item.product?.name ?? 'Apparel Piece'}
                      </h4>
                      <p className="font-sans text-xs text-black/60 mt-0.5">
                        {item.variant?.colourName} &bull; Size {item.size}
                      </p>
                      <p className="font-sans text-xs font-semibold text-black mt-1">
                        {priceFormatted}
                      </p>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-line bg-bg">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.variantId,
                                item.size,
                                item.quantity - 1,
                              )
                            }
                            aria-label="Decrease quantity"
                            className="w-7 h-7 flex items-center justify-center font-display text-xs hover:bg-bg-2"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-sans text-xs font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.variantId,
                                item.size,
                                item.quantity + 1,
                              )
                            }
                            aria-label="Increase quantity"
                            className="w-7 h-7 flex items-center justify-center font-display text-xs hover:bg-bg-2"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(item.productId, item.variantId, item.size)
                          }
                          className="text-[11px] uppercase tracking-caption text-black/50 hover:text-black underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {resolvedItems.length > 0 && (
          <div className="p-6 border-t border-line bg-bg space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs uppercase tracking-caption text-black/70">
                Subtotal
              </span>
              <span className="font-sans text-base font-bold text-black">
                {formattedSubtotal}
              </span>
            </div>
            <p className="font-sans text-[11px] text-black/60">
              Complimentary express domestic shipping included.
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="min-h-touch w-full inline-flex items-center justify-center bg-olive text-offwhite px-6 py-3 font-display uppercase tracking-display hover:opacity-95 transition-opacity text-center text-sm"
              >
                PROCEED TO CHECKOUT &rarr;
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="min-h-touch w-full inline-flex items-center justify-center border border-line bg-white text-black px-6 py-2.5 font-display uppercase tracking-display hover:border-black transition-colors text-center text-xs"
              >
                VIEW FULL CART
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

