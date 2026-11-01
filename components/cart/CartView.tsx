'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { PRODUCTS } from '@/data/products';
import { SiteHeader } from '@/components/ui/SiteHeader';

export function CartView() {
  const { items, removeItem, updateQuantity, hasHydrated } = useCartStore();

  const resolvedItems = items.map((item) => {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    const variant =
      product?.variants.find((v) => v.id === item.variantId) ??
      product?.variants[0];
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

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="flex min-h-screen flex-col justify-between p-6 md:p-12">
      <SiteHeader backHref="/" backLabel="&larr; Return to Shopping" />

      <section className="my-10 max-w-4xl mx-auto w-full">
        <div className="border-b border-line pb-4 mb-8">
          <span className="font-accent text-lg text-olive">Your Selection</span>
          <h1 className="font-display text-h2 uppercase text-black tracking-display mt-1">
            SHOPPING CART ({totalQuantity})
          </h1>
        </div>

        {!hasHydrated ? (
          <div className="py-16 text-center text-sm text-black/60">
            Loading your bag...
          </div>
        ) : resolvedItems.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-line p-12 bg-white/60">
            <span className="font-accent text-lg text-olive mb-2 block">
              Bag Empty
            </span>
            <p className="font-sans text-base text-black/70 mb-8 max-w-sm mx-auto">
              You haven&apos;t added any tactile apparel pieces yet. Browse our signature interactive rail to choose your fit.
            </p>
            <Link
              href="/"
              className="min-h-touch min-w-touch inline-flex items-center justify-center bg-olive text-offwhite px-8 py-3.5 font-display uppercase tracking-display hover:opacity-95 transition-opacity"
            >
              EXPLORE THE RAIL
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="divide-y divide-line border-t border-b border-line bg-white/80">
                {resolvedItems.map((item) => {
                  const unitPriceFormatted = `₹${(item.unitPrice / 100).toLocaleString(
                    'en-IN',
                    { minimumFractionDigits: 2 },
                  )}`;
                  const itemTotalFormatted = `₹${(item.itemTotal / 100).toLocaleString(
                    'en-IN',
                    { minimumFractionDigits: 2 },
                  )}`;

                  return (
                    <div
                      key={`${item.productId}-${item.variantId}-${item.size}`}
                      className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4"
                    >
                      {/* Product Thumbnail and Info */}
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-24 bg-bg-2 border border-line flex-shrink-0 flex items-center justify-center p-2">
                          {item.variant ? (
                            <Image
                              src={item.variant.frontTexture}
                              alt={item.product?.name ?? 'Garment'}
                              fill
                              sizes="80px"
                              className="object-contain p-1"
                            />
                          ) : (
                            <span className="font-display text-xs">FITYN</span>
                          )}
                        </div>

                        <div>
                          <Link
                            href={
                              item.product
                                ? `/product/${item.product.slug}`
                                : '/'
                            }
                            className="font-display text-base uppercase tracking-display text-black hover:text-olive transition-colors"
                          >
                            {item.product?.name ?? 'Apparel Item'}
                          </Link>
                          <p className="font-sans text-xs text-black/60 mt-0.5">
                            Colour: {item.variant?.colourName} &bull; Size:{' '}
                            <span className="font-semibold text-black">
                              {item.size}
                            </span>
                          </p>
                          <p className="font-sans text-xs text-black/70 mt-1">
                            Unit Price: {unitPriceFormatted}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls and Actions */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <div className="flex items-center border border-line bg-white">
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
                            className="w-8 h-8 flex items-center justify-center font-display text-xs hover:bg-bg-2"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="w-10 text-center font-sans text-xs font-semibold">
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
                            className="w-8 h-8 flex items-center justify-center font-display text-xs hover:bg-bg-2"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right min-w-[90px]">
                          <span className="font-sans text-sm font-bold text-black block">
                            {itemTotalFormatted}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              removeItem(
                                item.productId,
                                item.variantId,
                                item.size,
                              )
                            }
                            className="text-[11px] uppercase tracking-caption text-black/50 hover:text-black underline mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-2">
                <Link
                  href="/"
                  className="text-xs uppercase tracking-caption text-black/70 hover:text-black underline"
                >
                  &larr; Add more pieces from rail
                </Link>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="bg-white/90 border border-line p-6 space-y-5 shadow-xs">
              <h3 className="font-display text-base uppercase tracking-display text-black border-b border-line pb-3">
                ORDER SUMMARY
              </h3>

              <div className="space-y-3 font-sans text-xs">
                <div className="flex justify-between text-black/70">
                  <span>Subtotal ({totalQuantity} items)</span>
                  <span className="font-semibold text-black">
                    {formattedSubtotal}
                  </span>
                </div>
                <div className="flex justify-between text-black/70">
                  <span>Domestic Express Shipping</span>
                  <span className="text-olive font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-black/70">
                  <span>GST (18% included)</span>
                  <span>Calculated</span>
                </div>
              </div>

              <div className="border-t border-line pt-4 flex justify-between items-center">
                <span className="font-display text-sm uppercase tracking-display text-black">
                  ESTIMATED TOTAL
                </span>
                <span className="font-sans text-xl font-bold text-black">
                  {formattedSubtotal}
                </span>
              </div>

              <p className="font-sans text-[11px] text-black/60 leading-tight">
                All duties, taxes, and express domestic courier shipping are included in the price.
              </p>

              <Link
                href="/checkout"
                className="min-h-touch min-w-touch w-full inline-flex items-center justify-center bg-olive text-offwhite px-8 py-3.5 font-display uppercase tracking-display hover:opacity-95 transition-opacity text-center text-sm"
              >
                PROCEED TO CHECKOUT &rarr;
              </Link>
            </div>
          </div>
        )}
      </section>

      <footer className="border-t border-line pt-4 text-xs uppercase tracking-caption text-black/60 flex justify-between">
        <span>FITYN &bull; Wear the Calm</span>
        <span>Route: /cart</span>
      </footer>
    </main>
  );
}

