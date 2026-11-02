# FITYN Baseline Analysis & Reference Reproduction Log

**Date:** 2026-11-02  
**Target URL:** https://abhirbhatt.github.io/FITYN/  
**Local Test Environment:** Next.js 15.1.7, React 19.0.0, Three.js 0.174.0, R3F 9.0.4, Zustand 5.0.3, Tailwind CSS 3.4.17.  

---

## 1. Scene & Canvas Geometry Baseline

- **Canvas Container:**
  - Located in `components/scene/PersistentSceneHost.tsx`.
  - Position: `fixed inset-0 pointer-events-none z-0`.
  - Child Canvas pointer events: Interactive garment meshes and buttons capture pointer events (`pointer-events-auto` on overlays, raycasting on 3D meshes).
- **Camera Configuration:**
  - Perspective camera with FOV: 26° (centralized in `lib/referenceTokens.ts`).
  - Position: `[0, -0.02, 4.3]` in rail mode, `[0, -0.05, 3.25]` in focus mode.
  - Low FOV prevents wide-angle barrel distortion, providing the quasi-orthographic architectural look seen on luxury fashion interactive rails.
- **Garment Geometry:**
  - Double-sided textured `PlaneGeometry(1.75, 1.75)` with customized GLSL vertex & fragment shaders (`components/three/shaders/garmentShader.ts`).
  - Hanger hook: Torus & cylinder geometry (`components/three/Hanger.tsx`) hooking over the steel horizontal rail cylinder at $y = 1.25$.
  - Suspension: Vertical steel drop cables with bracket collars suspended from ceiling (`components/three/RailGeometry.tsx`).
- **Asset Pipeline & Paths:**
  - All 69 garment textures (front & back across all 7 garments and colorway variants) are generated as transparent WebP assets.
  - Asset resolution paths utilize `assetPath()` helper to resolve seamlessly under GitHub Pages basePath (`/FITYN`) and local dev root (`/`).
  - Zero 404 texture requests verified.

---

## 2. Reference Video Interaction Mapping

| State / Trigger | Reference Video Behavior | Implementation Details |
|---|---|---|
| **Rail Idle (0-3s)** | 7 garments suspended along steel bar; active garment centered, inactive garments slightly dimmed & softened. | `GarmentRail.tsx` with spacing 2.18, neighbor dimming ($uDim = 0.60$) and bokeh mipBias ($2.8$). |
| **Trackpad / Horizontal Drag (3-5s)** | Horizontal rail scrolling with inertia damping; snapping nearest garment to center. | Pointer drag and wheel event listeners in `GarmentRail.tsx` with smooth dampening ($0.88$). |
| **Garment Selection / Focus (5-8s)** | Clicking active garment or "SEE AVAILABILITY" zooms into focused mode (~40-45% height), background neighbors heavily fade ($0.45$) and blur; rail bar and header fade out; Hang tag, title, and FRONT/BACK toggle appear. | Focus mode state in `useSceneStore.ts` (`mode: 'rail' \| 'focus'`) with camera dolly and scale transition. |
| **Colourway Swap (~8-9s)** | Clicking hang-tag or colour swatches swaps active garment colourway without affecting other garments. | Per-garment colourway state `garmentColourways[idx]` in `useSceneStore.ts` with procedural noise wipe. |
| **180° Flip Toggle (~10-12s)** | FRONT/BACK segmented pill flips garment about vertical Y axis (0 to $\pi$) showing thin edge-on sliver at mid-flip. | `meshRef.current.rotation.y = THREE.MathUtils.lerp(..., isFlipped ? Math.PI : 0, ...)`. |
| **Return to Rail / Deselect (~12s)** | Esc key or clicking backdrop smoothly restores full rail mode. | Backdrop click and Esc listener in `GarmentControls.tsx`. |

---

## 3. Verified Performance & Quality
- **Routes verified (HTTP 200 OK + Attached CSS):**
  - `/`
  - `/product/heavyweight-boxy-tee`
  - `/collections`
  - `/collections/monochrome-essentials`
  - `/cart`
  - `/checkout`
  - `/checkout/success`
- **Render Loop:** Single unified R3F render loop (`frameloop="demand"` with reactive `invalidate()` triggers).
- **Reduced Motion:** Fully honors `prefers-reduced-motion` across GSAP, CSS, and Three.js physics.
