# FITYN

A 3D clothing storefront built with Next.js 15, React Three Fiber, and Tailwind CSS.

Instead of traditional flat product grids, the store uses an interactive 3D rail where garments can be scrolled horizontally, inspected, and flipped to view front and back prints. The project includes a complete e-commerce flow from product selection to checkout.

## Features

- **Interactive 3D Rail**: Garments are rendered on a continuous 3D rail using Three.js and React Three Fiber with camera transitions and front/back flip controls.
- **2D Fallback**: Automatic CSS-based rail fallback for devices without WebGL support or when reduced motion is preferred.
- **Product Details**: Variant and colorway switching, size picker, and garment specifications.
- **Cart & State Management**: Persistent cart state managed with Zustand, including slide-out drawer and full cart review.
- **Checkout Flow**: Multi-step checkout with shipping calculation, form validation using Zod, and order reference generation.
- **Asset Pipeline**: Node script using Sharp to generate transparent multi-resolution WebP garment textures from SVG sources.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- Three.js / React Three Fiber / Drei
- Zustand
- Tailwind CSS
- Zod
- Sharp

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm

### Installation

```bash
git clone https://github.com/abhirbhatt/FITYN.git
cd FITYN
pnpm install
```

### Running Locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Commands

- `pnpm dev` - Start local development server
- `pnpm build` - Create production build
- `pnpm start` - Start production server
- `pnpm typecheck` - Run TypeScript compiler checks
- `pnpm lint` - Run ESLint
- `pnpm generate:assets` - Generate WebP garment textures
- `pnpm validate:assets` - Validate image dimensions and catalog integrity
