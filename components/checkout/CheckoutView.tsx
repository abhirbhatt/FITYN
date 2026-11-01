'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useCartStore } from '@/store/useCartStore';
import { useOrderStore } from '@/store/useOrderStore';
import { PRODUCTS } from '@/data/products';
import { SiteHeader } from '@/components/ui/SiteHeader';
import { Order, CartItem } from '@/lib/types/commerce';

const CheckoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Please enter your full name (at least 2 characters)'),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  street: z
    .string()
    .trim()
    .min(5, 'Please enter your complete street address (at least 5 characters)'),
  city: z.string().trim().min(2, 'Please enter your city'),
  state: z.string().trim().min(2, 'Please enter your state'),
  postalCode: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit Indian PIN code'),
});

type CheckoutFormData = z.infer<typeof CheckoutSchema>;

export function CheckoutView() {
  const router = useRouter();
  const { items, clearCart, hasHydrated } = useCartStore();
  const { setCurrentOrder } = useOrderStore();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resolve items against PRODUCTS catalog
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

  const handleChange = (
    field: keyof CheckoutFormData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate form inputs using Zod
    const result = CheckoutSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CheckoutFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty. Please add items before placing an order.');
      return;
    }

    setIsSubmitting(true);

    // Build typed Order structure
    const orderItems: CartItem[] = resolvedItems.map((item) => ({
      productId: item.productId,
      variantId: item.variantId,
      size: item.size,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      productName: item.product?.name ?? 'Apparel Item',
      colourName: item.variant?.colourName ?? 'Standard',
      thumbnail: item.variant?.frontTexture ?? '/garments/rail/rail-metal-1024.webp',
    }));

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `FIT-${new Date().getFullYear()}-${randomNum}`;

    const newOrder: Order = {
      id: `ord_${Date.now()}_${randomNum}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      items: orderItems,
      subtotal,
      shipping: 0,
      total: subtotal,
      customer: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      },
      shippingAddress: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: 'India',
      },
      status: 'CONFIRMED',
    };

    // Store in global order state and clear cart
    setCurrentOrder(newOrder);
    clearCart();

    // Navigate to confirmation page
    router.push('/checkout/success');
  };

  return (
    <main className="flex min-h-screen flex-col justify-between p-6 md:p-12">
      <SiteHeader backHref="/cart" backLabel="&larr; Return to Cart" />

      <section className="my-10 max-w-5xl mx-auto w-full">
        <div className="border-b border-line pb-4 mb-8">
          <span className="font-accent text-lg text-olive">Order Placement</span>
          <h1 className="font-display text-h2 uppercase text-black tracking-display mt-1">
            CHECKOUT
          </h1>
          <p className="font-sans text-xs uppercase tracking-caption text-black/60 mt-1">
            Complimentary domestic express delivery &bull; Mock payment verification
          </p>
        </div>

        {hasHydrated && items.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-line p-12 bg-white/60">
            <span className="font-accent text-lg text-olive mb-2 block">
              No Items to Checkout
            </span>
            <p className="font-sans text-sm text-black/70 mb-6">
              Your bag is empty. Please select apparel pieces from our interactive rail before checking out.
            </p>
            <Link
              href="/"
              className="min-h-touch inline-flex items-center justify-center bg-olive text-offwhite px-8 py-3.5 font-display uppercase tracking-display hover:opacity-95 transition-opacity"
            >
              EXPLORE THE RAIL
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Form Fields Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step 1: Contact Information */}
              <div className="bg-white/90 border border-line p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="border-b border-line pb-3 flex items-center justify-between">
                  <h2 className="font-display text-base uppercase tracking-display text-black">
                    1. CONTACT INFORMATION
                  </h2>
                  <span className="font-sans text-xs text-black/50">Required</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-caption text-black/70 mb-1.5 font-semibold">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className={`w-full min-h-touch px-4 bg-white border font-sans text-sm focus:outline-none transition-colors ${
                        errors.fullName ? 'border-red-500 ring-1 ring-red-500' : 'border-line focus:border-olive'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="font-sans text-xs text-red-600 mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-sans text-xs uppercase tracking-caption text-black/70 mb-1.5 font-semibold">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="aarav@example.com"
                        className={`w-full min-h-touch px-4 bg-white border font-sans text-sm focus:outline-none transition-colors ${
                          errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-line focus:border-olive'
                        }`}
                      />
                      {errors.email && (
                        <p className="font-sans text-xs text-red-600 mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-sans text-xs uppercase tracking-caption text-black/70 mb-1.5 font-semibold">
                        Mobile Phone (10 digits) *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="9876543210"
                        maxLength={10}
                        className={`w-full min-h-touch px-4 bg-white border font-sans text-sm focus:outline-none transition-colors ${
                          errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-line focus:border-olive'
                        }`}
                      />
                      {errors.phone && (
                        <p className="font-sans text-xs text-red-600 mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Destination */}
              <div className="bg-white/90 border border-line p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="border-b border-line pb-3 flex items-center justify-between">
                  <h2 className="font-display text-base uppercase tracking-display text-black">
                    2. SHIPPING DESTINATION
                  </h2>
                  <span className="font-sans text-xs text-black/50">Domestic Express</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-caption text-black/70 mb-1.5 font-semibold">
                      Street Address &bull; Flat / House No. *
                    </label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={(e) => handleChange('street', e.target.value)}
                      placeholder="Plot 42, Calm Enclave, Indiranagar"
                      className={`w-full min-h-touch px-4 bg-white border font-sans text-sm focus:outline-none transition-colors ${
                        errors.street ? 'border-red-500 ring-1 ring-red-500' : 'border-line focus:border-olive'
                      }`}
                    />
                    {errors.street && (
                      <p className="font-sans text-xs text-red-600 mt-1">
                        {errors.street}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-sans text-xs uppercase tracking-caption text-black/70 mb-1.5 font-semibold">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        placeholder="Bengaluru"
                        className={`w-full min-h-touch px-4 bg-white border font-sans text-sm focus:outline-none transition-colors ${
                          errors.city ? 'border-red-500 ring-1 ring-red-500' : 'border-line focus:border-olive'
                        }`}
                      />
                      {errors.city && (
                        <p className="font-sans text-xs text-red-600 mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-sans text-xs uppercase tracking-caption text-black/70 mb-1.5 font-semibold">
                        State *
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        placeholder="Karnataka"
                        className={`w-full min-h-touch px-4 bg-white border font-sans text-sm focus:outline-none transition-colors ${
                          errors.state ? 'border-red-500 ring-1 ring-red-500' : 'border-line focus:border-olive'
                        }`}
                      />
                      {errors.state && (
                        <p className="font-sans text-xs text-red-600 mt-1">
                          {errors.state}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-sans text-xs uppercase tracking-caption text-black/70 mb-1.5 font-semibold">
                        PIN Code (6 digits) *
                      </label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => handleChange('postalCode', e.target.value)}
                        placeholder="560038"
                        maxLength={6}
                        className={`w-full min-h-touch px-4 bg-white border font-sans text-sm focus:outline-none transition-colors ${
                          errors.postalCode ? 'border-red-500 ring-1 ring-red-500' : 'border-line focus:border-olive'
                        }`}
                      />
                      {errors.postalCode && (
                        <p className="font-sans text-xs text-red-600 mt-1">
                          {errors.postalCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method Info */}
              <div className="bg-bg-2 border border-line p-6 space-y-3">
                <span className="font-accent text-sm text-olive">Secure Transaction</span>
                <h3 className="font-display text-sm uppercase tracking-display text-black">
                  3. PAYMENT SETTLEMENT &bull; MOCK PROTOTYPE
                </h3>
                <p className="font-sans text-xs text-black/70 leading-relaxed">
                  For this evaluation release, checkout operates in sandbox test mode. No credit card or live payment provider is billed. Clicking below registers your order and generates an official mock dispatch receipt.
                </p>
              </div>
            </div>

            {/* Order Review & Submit Column */}
            <div className="bg-white/95 border border-line p-6 sm:p-8 space-y-6 shadow-xs sticky top-8">
              <h3 className="font-display text-base uppercase tracking-display text-black border-b border-line pb-3">
                ORDER REVIEW
              </h3>

              {/* Items Summary */}
              <div className="divide-y divide-line max-h-60 overflow-y-auto pr-1">
                {resolvedItems.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId}-${item.size}`}
                    className="py-3 flex items-center gap-3 text-xs"
                  >
                    <div className="relative w-12 h-14 bg-bg-2 border border-line flex-shrink-0 flex items-center justify-center p-1">
                      {item.variant && (
                        <Image
                          src={item.variant.frontTexture}
                          alt={item.product?.name ?? 'Garment'}
                          fill
                          sizes="48px"
                          className="object-contain p-0.5"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display uppercase tracking-display text-black truncate">
                        {item.product?.name}
                      </p>
                      <p className="text-black/60 font-sans text-[11px]">
                        {item.variant?.colourName} &bull; Size {item.size} &bull; Qty {item.quantity}
                      </p>
                    </div>
                    <span className="font-sans font-semibold text-black">
                      ₹{((item.itemTotal) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-line pt-4 space-y-2.5 font-sans text-xs">
                <div className="flex justify-between text-black/70">
                  <span>Subtotal</span>
                  <span className="font-semibold text-black">{formattedSubtotal}</span>
                </div>
                <div className="flex justify-between text-black/70">
                  <span>Express Domestic Delivery</span>
                  <span className="text-olive font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-black/70">
                  <span>Taxes (GST 18% included)</span>
                  <span>₹0.00</span>
                </div>
                <div className="border-t border-line pt-3 flex justify-between items-center text-sm">
                  <span className="font-display uppercase tracking-display text-black font-bold">
                    GRAND TOTAL
                  </span>
                  <span className="font-sans text-xl font-bold text-black">
                    {formattedSubtotal}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`min-h-touch min-w-touch w-full inline-flex items-center justify-center bg-olive text-offwhite px-8 py-4 font-display uppercase tracking-display text-sm transition-all shadow-md ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-95'
                }`}
              >
                {isSubmitting ? 'CONFIRMING ORDER...' : 'COMPLETE MOCK ORDER \u2192'}
              </button>
            </div>
          </form>
        )}
      </section>

      <footer className="border-t border-line pt-4 text-xs uppercase tracking-caption text-black/60 flex justify-between">
        <span>FITYN &bull; Wear the Calm</span>
        <span>Route: /checkout</span>
      </footer>
    </main>
  );
}

