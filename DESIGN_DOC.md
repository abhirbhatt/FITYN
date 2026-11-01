# FITYN — Design Doc

**Mood:** minimal, calm, gallery-like. Lots of empty space, one hero object (the garment), smooth motion, no clutter.

## 1. Colour tokens

| Token | Hex | Use |
|---|---|---|
| `--offwhite` | `#FFF2B4` | Text/icons ON olive or black surfaces, marquee text, button text |
| `--olive` | `#486C2F` | Marquee bar, primary buttons, active states, links on light bg |
| `--black` | `#0A0A0A` | Headings and body text on light bg, tags, toggle active |
| `--bg` | `#F3F3F0` | Page/scene background (soft gray-white) |
| `--bg-2` | `#E9E9E4` | Cards, subtle sections |
| `--line` | `#D4D4CE` | Borders, dividers |
| `--white` | `#FFFFFF` | Highlights, inputs |

Contrast (approx.): olive on white ≈ 6:1, offwhite on olive ≈ 5.4:1, offwhite on black ≈ 18:1 — all pass AA. **Never** put `#FFF2B4` text on `--bg`.

## 2. Typography

- **Anton** — headings, product titles (uppercase), buttons, marquee. Tracking `0.02em`.
- **Yellowtail** — accent only (tagline, one word in hero, small flourish). Never for body.
- **System sans** (assumption) — paragraphs, forms, prices.

Scale (mobile → desktop): H1 `clamp(2.5rem, 8vw, 6rem)`, H2 `clamp(1.75rem, 4vw, 3rem)`, body `16px`, caption `12px` uppercase.

## 3. Layout & components

- **Header:** centered wordmark FITYN, cart icon right, menu left. Transparent, no border.
- **Hero + Rail (home):** full-viewport scene. Thin metal rail across top third, garments hanging. Caption under active garment. Pill CTA "SEE AVAILABILITY" (olive bg, offwhite text).
- **Marquee:** fixed bottom bar, olive, offwhite Anton text, placeholder: `NEW DROPS • FITYN • WEAR THE CALM • LIMITED RUN •`, slow constant speed, pauses on hover.
- **Product view:** active garment centred, others blurred behind. Title (Anton, uppercase), FRONT/BACK segmented toggle (black active), colour swatches, size selector, "Add to cart", underlined "See details ↗".
- **Arrows:** circular, 44px min tap target, left/right of garment.
- **Collections:** minimal grid, garment image on `--bg-2`, name + price, hover = slight lift.
- **Cart drawer:** slides from right, line items, qty stepper, subtotal, checkout button.
- **Checkout:** single column, 3 steps (contact, shipping, review). Payment step shows "coming soon" placeholder.

## 4. Motion

| Interaction | Behaviour |
|---|---|
| Idle | Garments sway lightly (wind shader, ±1.5°) |
| Hover/scroll | Active garment eases forward, others blur & recede (0.8s, `power3.out`) |
| Select | Camera dolly-in + tag fade/swing |
| Flip | rotateY 180°, 0.9s, `power2.inOut` |
| Colour change | Bottom-to-top noisy wipe, 0.8s |
| Page change | Canvas persists; UI fades 0.3s |
| Smooth scroll | Lenis (disabled on `prefers-reduced-motion`) |

Rules: only animate `transform`/`opacity`/shader uniforms. Respect `prefers-reduced-motion` (no sway, instant transitions).

## 5. Responsive

- Mobile: 5 garments visible on rail (swipe to see more), controls at thumb reach, toggle + CTA stacked.
- Tablet/desktop: 7 garments, arrows visible, hover effects enabled.
- Touch: no hover dependence; tap = select.

## 6. Accessibility

- All 3D interactions have DOM equivalents (buttons/links), keyboard navigable.
- Visible focus ring (olive 2px).
- `aria-live` announces active product name.
- Alt text on all images, canvas `aria-hidden` with parallel semantic list.
- Min tap target 44×44.
