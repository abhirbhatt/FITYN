# FITYN — 3D Gallery-Minimal Clothing Store

An architectural, gallery-minimal e-commerce storefront for contemporary apparel featuring an interactive, physics-free 3D garment rail built with Next.js 15 App Router, React 19, Three.js / React Three Fiber, and Zustand.

---

## Overview

FITYN reimagines digital apparel shopping as a physical rail experience. Rather than static 2D product grids, garments hang on a continuous, textured 3D rail that responds smoothly to mouse, touch, and keyboard interactions.

### Key Features

- **Interactive 3D Garment Rail**: Textured planar garment meshes in Three.js/R3F with dynamic camera lerping, colorway switching, and front/back flip views.
- **Progressive Fallback**: Graceful 2D CSS-based fallback rail for devices without WebGL support or with reduced motion preferences.
- **Gallery-Minimal Aesthetic**: Strict design tokens with high-contrast neutral backgrounds (`#F3F3F0`, `#E9E9E4`), bold olive accents (`#486C2F`), off-white highlights (`#FFF2B4`), Anton display typography, and Inter system sans.
- **Complete Shopping Journey**:
  - Interactive homepage rail and collection browsing.
  - Product details with size and colorway selection.
  - Zustand-powered persistent cart with drawer and cart view.
  - Zod-validated mock checkout with shipping calculation and order reference generation.
  - Order confirmation screen.
- **Deterministic Asset Pipeline**: Automated generation and validation of 1024px & 2048px WebP garment textures from vector archetypes via Sharp.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router, Server Components + Client Views)
- **Runtime**: React 19
- **3D Engine**: Three.js, React Three Fiber, `@react-three/drei`
- **State Management**: Zustand
- **Styling**: Tailwind CSS & CSS custom property design tokens
- **Validation**: Zod
- **Asset Processing**: Sharp

---

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- pnpm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/abhirbhatt/FITYN.git
cd FITYN

# Install dependencies
pnpm install
```

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

- `pnpm dev`: Start the Next.js development server.
- `pnpm build`: Create a production build.
- `pnpm start`: Start the production server.
- `pnpm typecheck`: Run TypeScript compiler check.
- `pnpm lint`: Run ESLint.
- `pnpm generate:assets`: Generate multi-resolution WebP garment assets.
- `pnpm validate:assets`: Validate texture dimensions, alpha transparency, and catalog mapping.

---

## License

MIT
