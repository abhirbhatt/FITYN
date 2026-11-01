# FITYN — Reference Analysis & TODO

Source: 16.6s screen recording (33 frames analysed at 2 fps) of a streetwear site. Palette and brand are replaced with FITYN's (offwhite `#FFF2B4`, olive `#486C2F`, black, light gray/white base).

## 1. Frame-by-frame breakdown

| Time | What happens | FITYN equivalent |
|---|---|---|
| 0–1.5s | Light-gray scene, thin clothing rail, 7 garments hanging, small logo top-centre, caption below, pill CTA "SEE AVAILABILITY", green marquee at bottom | Same layout; marquee becomes olive with offwhite text |
| 1.5–3.5s | Garments come forward one by one (hover/scroll driven), others recede | Pointer/scroll → active index, GSAP tween of z/scale |
| 4–5s | Garments rotate in perspective (skewed look), camera pushes in | Plane rotateY + camera dolly |
| 5.5–7s | Selected garment centred, rest blurred (depth of field), hang tags appear, bold uppercase title, FRONT/BACK toggle, underlined link | Same; blur via texture mip-bias (cheap) |
| 8.5–10s | Colourway change with a bottom-to-top wipe | Shader wipe between two textures (noise edge) |
| 10–11s | BACK toggle → flip → back print visible | rotateY 180° with front/back textures |
| ~12s | Left/right circular arrows around the product | Prev/next buttons + keyboard + swipe |
| 12.5–16.6s | Instagram outro (not part of site) | Ignore |

## 2. Same-to-same vs approximate vs hard

**Same-to-same:** rail layout, active-garment focus, blur-behind, FRONT/BACK flip, colour wipe, hang-tag swing, marquee, pill button, arrows, smooth scroll.
**Approximate:** fabric realism (depends on final photos), exact easing curves (tuned by eye).
**Hard / skipped:** true cloth simulation. We use a vertex-shader wind sway instead (cheap, runs on mid-range phones).

## 3. Decisions locked

- Garments = textured photo-planes inside a 3D (R3F) scene. Demo/placeholder garments for now.
- Interactivity: click select, flip front/back, colour change. Light wind sway.
- Pages: Home (hero + rail), Product view, Collections, Cart, Checkout (UI only), payment gateway later.
- No dark mode, no auth, hosting undecided.
- Must run smoothly on ~₹10k phones (assumed 4–6 GB RAM, Snapdragon 680 / Helio G85 class).
- Fonts: Anton (primary), Yellowtail (accent). Colours: `#FFF2B4`, `#486C2F`, black.
- Placeholder copy everywhere.

## 4. Assumptions (change if wrong)

- Body/UI small text font was not specified → using a neutral system sans stack for paragraphs and form labels; Anton for headings/buttons, Yellowtail for accents only.
- `#FFF2B4` is a cream-yellow. It is **unreadable on white/light gray**, so it is used only on olive/black surfaces (marquee, buttons, overlays). Text on light backgrounds is black or olive.
- Currency INR, locale en-IN (placeholder).

## 5. TODO

### Phase 0 — Setup
- [ ] Next.js (App Router) + TypeScript + Tailwind, ESLint, Prettier
- [ ] Design tokens (colours, fonts via `next/font`, spacing)
- [ ] Persistent `<Canvas>` in root layout, scene driven by route

### Phase 1 — Assets
- [ ] Script to generate placeholder garments (tank, tee, hoodie, jacket, cap) as transparent WebP/KTX2, 2 colourways + back view
- [ ] Hang-tag, hanger, rail textures
- [ ] Soft blob shadow texture

### Phase 2 — Core 3D
- [ ] Rail scene with 7 garment planes
- [ ] Wind-sway vertex shader (weight by distance from hanger)
- [ ] Active-garment focus (scale/z, camera dolly) + blur-behind via mip bias
- [ ] Front/back flip, colour wipe shader
- [ ] Hang-tag pendulum (damped spring)
- [ ] Prev/next, keyboard, swipe

### Phase 3 — Pages & UI
- [ ] Home hero + rail, marquee, header
- [ ] Product view (title, toggle, colour swatches, size, add to cart)
- [ ] Collections list + collection page
- [ ] Cart drawer + cart page (Zustand, localStorage)
- [ ] Checkout UI (mock order, no payment), success page

### Phase 4 — Performance & Security
- [ ] Quality tiers (high / medium / low) with auto downgrade
- [ ] Low tier = 2D CSS fallback (no WebGL needed)
- [ ] Follow `OPTIMIZATION_SECURITY.md` checklist
- [ ] Test on a real ~₹10k phone, Lighthouse mobile ≥ 90

### Phase 5 — Later
- [ ] Real commerce backend (see `TECH_STACK.md`)
- [ ] Payment gateway (Razorpay for India / Stripe)
- [ ] Real product photography, hosting, auth, dark mode
