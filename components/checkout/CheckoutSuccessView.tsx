'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useOrderStore } from '@/store/useOrderStore';
import { SiteHeader } from '@/components/ui/SiteHeader';

export function CheckoutSuccessView() {
  const { currentOrder } = useOrderStore();

  if (!currentOrder) {
    return (
      <main className="flex min-h-screen flex-col justify-between p-6 md:p-12">
        <SiteHeader backHref="/" backLabel="&larr; Return to Rail" />

        <section className="my-16 max-w-lg mx-auto w-full text-center">
          <div className="bg-white/95 border border-line p-8 md:p-12 shadow-sm">
            <span className="font-accent text-lg text-olive block mb-1">
              Session Inactive
            </span>
            <h1 className="font-display text-2xl uppercase tracking-display text-black mb-3">
              NO RECENT ORDER FOUND
            </h1>
            <p className="font-sans text-sm text-black/70 mb-8 leading-relaxed">
              No recent order is recorded in your current browser session. If you recently placed an order, please check your email for the dispatch tracking receipt.
            </p>
            <Link
              href="/"
              className="min-h-touch inline-flex items-center justify-center bg-olive text-offwhite px-8 py-3.5 font-display uppercase tracking-display hover:opacity-95 transition-opacity text-sm"
            >
              EXPLORE THE RAIL &rarr;
            </Link>
          </div>
        </section>

        <footer className="border-t border-line pt-4 text-xs uppercase tracking-caption text-black/60 flex justify-between">
          <span>FITYN &bull; Wear the Calm</span>
          <span>Route: /checkout/success</span>
        </footer>
      </main>
    );
  }

  const formattedDate = new Date(currentOrder.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const totalFormatted = `₹${(currentOrder.total / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
  })}`;

  return (
    <main className="flex min-h-screen flex-col justify-between p-6 md:p-12">
      <SiteHeader backHref="/" backLabel="&larr; Return to Rail" />

      <section className="my-10 max-w-2xl mx-auto w-full">
        <div className="bg-white/95 border border-line p-8 md:p-10 shadow-sm text-center">
          {/* Olive Check Icon */}
          <div className="w-16 h-16 bg-olive text-offwhite flex items-center justify-center mx-auto mb-6 shadow-xs">
            <span className="font-display text-2xl select-none">&check;</span>
          </div>

          <span className="font-accent text-lg text-olive block mb-1">
            Receipt Generated &bull; Wear the Calm
          </span>
          <h1 className="font-display text-h2 uppercase text-black tracking-display mb-2">
            THANK YOU
          </h1>
          <p className="font-mono text-sm uppercase tracking-caption text-black/80 font-semibold mb-6">
            Order Reference: <span className="text-olive">{currentOrder.orderNumber}</span>
          </p>

          <p className="font-sans text-xs text-black/60 mb-8 border-b border-line pb-4">
            Placed on {formattedDate} &bull; Confirmation dispatch sent to{' '}
            <span className="font-medium text-black">
              {currentOrder.customer.email}
            </span>
          </p>

          {/* Itemized Order Breakdown */}
          <div className="text-left mb-8 border-b border-line pb-6">
            <h3 className="font-display text-xs uppercase tracking-display text-black mb-4">
              ITEMS IN THIS SHIPMENT
            </h3>
            <div className="divide-y divide-line">
              {currentOrder.items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}-${item.size}`}
                  className="py-3 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-14 bg-bg-2 border border-line flex-shrink-0 flex items-center justify-center p-1">
                      <Image
                        src={item.thumbnail}
                        alt={item.productName}
                        fill
                        sizes="48px"
                        unoptimized
                        className="object-contain p-0.5"
                      />
                    </div>
                    <div>
                      <h4 className="font-display uppercase tracking-display text-black">
                        {item.productName}
                      </h4>
                      <p className="font-sans text-[11px] text-black/60">
                        {item.colourName} &bull; Size {item.size} &bull; Qty {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-sans font-semibold text-black">
                    ₹{((item.unitPrice * item.quantity) / 100).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))}
            </div>

            {/* Delivery Address & Total Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-4 border-t border-line text-xs font-sans">
              <div>
                <span className="font-semibold text-black uppercase tracking-caption block mb-1">
                  Shipping Destination
                </span>
                <p className="text-black/70">
                  {currentOrder.customer.fullName}
                </p>
                <p className="text-black/70">
                  {currentOrder.shippingAddress.street}
                </p>
                <p className="text-black/70">
                  {currentOrder.shippingAddress.city},{' '}
                  {currentOrder.shippingAddress.state} &ndash;{' '}
                  {currentOrder.shippingAddress.postalCode}
                </p>
                <p className="text-black/70">
                  Phone: {currentOrder.customer.phone}
                </p>
              </div>

              <div className="sm:text-right">
                <span className="font-semibold text-black uppercase tracking-caption block mb-1">
                  Payment Status
                </span>
                <p className="text-olive font-semibold">
                  Settled &bull; Mock Prototype
                </p>
                <p className="text-black/60 mt-2">
                  Total Amount Paid:{' '}
                  <span className="text-base font-bold text-black block sm:inline">
                    {totalFormatted}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Note */}
          <div className="bg-bg-2 p-4 text-xs font-sans text-black/75 mb-8 text-left leading-relaxed">
            <span className="font-semibold text-black block mb-1">
              Dispatch &amp; Delivery Schedule
            </span>
            All garments are inspected, packaged in custom biodegradable tissue, and dispatched from Bengaluru within 2&ndash;3 business days via Express Courier.
          </div>

          {/* Return CTA */}
          <Link
            href="/"
            className="min-h-touch min-w-touch inline-flex items-center justify-center bg-black text-offwhite px-8 py-3.5 font-display uppercase tracking-display hover:opacity-95 transition-opacity text-sm"
          >
            RETURN TO THE RAIL
          </Link>
        </div>
      </section>

      <footer className="border-t border-line pt-4 text-xs uppercase tracking-caption text-black/60 flex justify-between">
        <span>FITYN &bull; Wear the Calm</span>
        <span>Route: /checkout/success</span>
      </footer>
    </main>
  );
}
