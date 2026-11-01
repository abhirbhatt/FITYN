# FITYN — Product Requirements Document

## 1. Overview
FITYN is a minimal clothing e-commerce site whose centrepiece is an interactive 3D clothing rail. Goal: make browsing feel like walking up to a real rack, while staying fast and smooth on mid-range phones.

## 2. Goals
- Premium, calm shopping experience driven by one signature 3D component.
- Smooth (≥ 30 fps on ~₹10k phones, 60 fps on desktops).
- Fast load, safe, ready to plug in a real backend and payments later.

## 3. Non-goals (this version)
Dark mode, user accounts/auth, real payments, hosting decision, real product photography, low-end (< ₹8k) phone optimisation beyond a 2D fallback.

## 4. Users
Fashion-aware shoppers on mobile (primary) and desktop, mostly India.

## 5. Features (v1)

| ID | Feature | Priority |
|---|---|---|
| F1 | Home hero with 3D rail of garments | P0 |
| F2 | Select garment → product view (focus + blur others) | P0 |
| F3 | Front/Back flip | P0 |
| F4 | Colour change with wipe transition | P0 |
| F5 | Light wind sway + hang-tag swing | P1 |
| F6 | Prev/next arrows, keyboard, swipe | P0 |
| F7 | Marquee ticker | P1 |
| F8 | Collections list and collection page | P0 |
| F9 | Cart (add/remove/qty, persisted) | P0 |
| F10 | Checkout UI with mock order and success page | P0 |
| F11 | Quality tiers + 2D fallback | P0 |
| F12 | Payment gateway | Later |

## 6. User flows
1. Land on home → see rail → hover/swipe garments → tap one → product view.
2. Product view → flip, change colour, pick size → Add to cart → cart drawer.
3. Cart → Checkout (contact → shipping → review) → mock success page.
4. Menu → Collections → pick collection → tap product → product view.

## 7. Routes
`/` · `/collections` · `/collections/[slug]` · `/product/[slug]` · `/cart` · `/checkout` · `/checkout/success` · `/404`

## 8. Data model (placeholder, backend-agnostic)
- **Product:** id, slug, name, price (INR paise), description, collectionIds, variants[]
- **Variant:** id, colourName, colourHex, sizes[{label, stock}], frontTexture, backTexture
- **Collection:** id, slug, name, productIds
- **CartItem:** productId, variantId, size, qty
- **Order (mock):** id, items, contact, shipping, total

Data accessed through a `CommerceProvider` interface so the mock can be swapped for a real backend without UI changes.

## 9. Non-functional requirements

| Area | Target |
|---|---|
| Performance | LCP < 2.5s on 4G mid-range phone; ≥ 30 fps interaction; initial JS < 170 KB gz (3D chunk lazy) |
| Compatibility | Last 2 versions of Chrome, Safari, Firefox, Edge; Android 9+, iOS 15+ |
| Accessibility | WCAG 2.1 AA |
| Security | Per `OPTIMIZATION_SECURITY.md` |
| SEO | SSR product/collection pages, metadata, structured data (Product schema) |

## 10. Success metrics
Lighthouse mobile ≥ 90, CLS < 0.1, INP < 200 ms, stable fps on test device, zero console errors, add-to-cart flow completes in ≤ 4 taps.

## 11. Risks
| Risk | Mitigation |
|---|---|
| Mid-range phones stutter | Quality tiers, DPR cap, mip-bias blur instead of post-processing, 2D fallback |
| Large textures | KTX2/WebP, ≤ 1024px on mobile, lazy load |
| WebGL unsupported | Automatic 2D fallback |
| Placeholder look weak | Clean generated silhouettes, swap to real photos later without code change |

## 12. Open items
Real product photos, real copy, body font confirmation, backend + payment + hosting choices.
