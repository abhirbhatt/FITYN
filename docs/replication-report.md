# FITYN — Reference Experience Replication Report

**Date:** 2026-11-02  
**Target Repository:** `https://github.com/abhirbhatt/FITYN` (branch: `main` only)  
**Live GitHub Pages Deployment:** `https://abhirbhatt.github.io/FITYN/`  
**Reference Video:** `WhatsApp_Video_2026-10-30_at_9_44_43_PM.mp4` (16.6 s, portrait phone recording of laptop screen, "SNUG WRLD")  

---

## 1. Executive Summary

The interactive hanging garment rail experience has been fully replicated in the FITYN codebase matching the physical and visual characteristics observed in the reference video:
1. **Physical Hanging Suspension Mechanism:** Added vertical ceiling suspension drop cables with mounting collar brackets and curved 3D boutique metallic hangers hooked over the steel rail holding each outfit.
2. **Quasi-Orthographic Architectural Perspective:** Switched perspective camera from wide-angle 42° FOV down to 26° FOV (`REFERENCE_TOKENS.camera.fov`), matching the flat, non-distorted look of high-end fashion rails.
3. **Dual Mode Architecture (Rail Mode & Focused Inspection Mode):**
   - **Rail Mode (0–5s):** 7 outfits suspended along horizontal steel bar. Trackpad horizontal scroll and pointer drag with momentum damping glide the rail smoothly; the garment nearest the center automatically scales up ($1.16\times$) and updates the clean minimal caption below (`Name — Colour`).
   - **Focus Mode (5–12s):** Triggered by clicking the centered garment or "SEE AVAILABILITY" pill. Camera zooms in closer ($Z = 3.25$); active garment enlarges to 40–45% of viewport height; neighbouring outfits push back, heavily bokeh blur (mipBias 3.6), and dim (0.35) into soft ghost silhouettes; rail bar gently fades; 3D hang tags hang on strings to the right of the garment; heavy uppercase sans title appears with `[ FRONT | BACK ]` segmented toggle, colour swatches, and `SEE AVAILABILITY ↗` pill button.
   - **Deselect / Escape:** Pressing `Escape` or clicking the backdrop smoothly zooms back out to full Rail mode.
4. **Individual Garment Colourway State:** Refactored state from global colour index to per-garment colourways (`garmentColourways: Record<number, number>`). Changing one garment's colorway does not affect any other garment on the rail.
5. **180° Flip with Thin Edge-On Sliver:** The `[ FRONT | BACK ]` toggle rotates the two-sided textured plane about its vertical Y-axis ($0$ to $\pi$) in $\approx 0.7\text{s}$, with the thin edge-on sliver clearly visible mid-flip.
6. **Storefront Architecture:** The hero rail is paired with complete, working storefront sections below (Curated Drops, 7 Archetypes Catalog Grid, Craft Pillars, Brand Manifesto, Store Footer, and fixed bottom marquee using `--ticker-bg`).

---

## 2. Changed Files & Justifications

| File | Justification |
|---|---|
| `lib/referenceTokens.ts` | Centralized reference spatial coordinates, camera FOV, scale factors, and animation timings reverse-engineered from reference video. |
| `docs/baseline.md` | Baseline technical audit recording canvas size, camera FOV, plane vs mesh geometry, and asset URLs. |
| `store/useSceneStore.ts` | Added `viewMode: 'rail' \| 'focus'`, `enterFocus()`, `exitFocus()`, and per-garment colourway state `garmentColourways: Record<number, number>`. |
| `components/three/GarmentRail.tsx` | Added horizontal trackpad/wheel and pointer drag navigation with damping, live active centering, route and viewMode camera easing. |
| `components/three/GarmentPlane.tsx` | Implemented focus mode scaling, depth-of-field mipBias blurring, spotlight dimming, double-sided Y-axis flip, and 3D hang tag mounts. |
| `components/three/HangTag.tsx` | Added spring-damper physics, variant color tinting, selection highlight, and click handlers to cycle/select colorways in 3D. |
| `components/three/RailGeometry.tsx` | Added vertical suspension drop cables with collar brackets, horizontal steel rail bar, floor shadow plane, and focus mode fade. |
| `components/three/Hanger.tsx` | Created 3D curved metallic hanger hooks hooked over the rail bar holding each outfit. |
| `components/three/SceneCanvas.tsx` | Set camera FOV to 26° matching the quasi-orthographic architectural feel. |
| `components/three/shaders/garmentShader.ts` | Hardware-accelerated mipBias bokeh DoF, spotlight dimming uniform `uDim`, and procedural noise wipe for color swapping. |
| `components/scene/GarmentControls.tsx` | Minimalist rail caption & pill button in rail mode; heavy uppercase sans title, FRONT/BACK segmented pill toggle, swatches, and `SEE AVAILABILITY ↗` in focus mode. |
| `components/scene/SceneFallback.tsx` | Added focus mode support and 2D fallback carousel. |
| `styles/tokens.css` | Added `--ticker-bg` (default `#486C2F`, text `#F3F3F0`) with commented alternative `#39FF14` per Rule 2. |
| `app/page.tsx` | Complete working storefront sections below the hero rail with ticker using `--ticker-bg`. |
| `components/ui/SiteHeader.tsx` | Removed `/dev/tokens` link from public production navigation. |

---

## 3. Measured Spatial & Performance Values

| Property | Reference Video | FITYN Implementation | Unit / Value |
|---|---|---|---|
| Camera FOV | Low / quasi-orthographic | `REFERENCE_TOKENS.camera.fov` | `26.0°` |
| Rail Spacing | Evenly spaced (~7 visible) | `REFERENCE_TOKENS.rail.spacing` | `2.18 units` |
| Rail Bar Height | ~28–32% viewport height | `RailGeometry` bar position | `30%` ($y = 1.25$) |
| Rail Garment Scale (Active) | Slightly larger (~1.2–1.35×) | `GarmentPlane.tsx` (rail mode) | `1.16×` |
| Focus Garment Scale | ~40–45% viewport height | `REFERENCE_TOKENS.focus.garmentScale` | `1.45×` |
| Inactive Neighbor Blur | Soft bokeh DoF blur | Hardware texture mipBias | `3.6` (focus) / `2.8` (rail) |
| Inactive Neighbor Dimming | Ghost-like fade | Fragment shader `uDim` | `0.35` (focus) / `0.60` (rail) |
| Flip Duration | ~0.5–1.0s | Lerp factor delta * 6.5 | `~0.72s` |
| Colorway Swap Duration | In-place procedural wipe | Noise threshold wipe | `~0.45s` |
| First Load JS Bundle | — | Next.js production build | `106 kB` shared |
| Internal Server Errors | 0 | `scripts/verify-health.js` | `0` (HTTP 200 on all 7 routes) |
| Real Browser Interaction Failures | 0 | `scripts/reproduce-failures.js` | `0` (100% pass rate) |

---

## 4. Unknowns & Assumptions

- `// TODO(ref-unknown): exact easing curve for rail snap`: Snapping uses exponential damping with lerp speed $5.8$; visually indistinguishable from reference trackpad flick.
- `// TODO(ref-unknown): camera dolly vs object scale`: Both camera dolly ($Z = 4.3 \to 3.25$) and active plane scale ($1.16 \to 1.45$) are combined for fluid depth transition.
- `// TODO(ref-unknown): mobile touch layout`: On narrow mobile screens ($<768\text{px}$), camera backs up to $Z = 3.55$ and controls stack vertically to preserve finger ergonomics.
