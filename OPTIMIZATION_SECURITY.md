# FITYN — Web Optimization, Code Splitting & Security

Target device: ~₹10k Android phone on 4G. Rule: if it is not needed for first paint, load it later.

## 1. Code splitting

1. **Route-level:** App Router splits per route automatically. Keep pages thin.
2. **3D chunk lazy:** load R3F/Three only on routes that need it:
   ```tsx
   const Scene = dynamic(() => import('@/components/three/Scene'), { ssr: false, loading: () => <SceneSkeleton /> })
   ```
3. **Defer heavy libs:** GSAP plugins, postprocessing, `detect-gpu` imported dynamically after first paint / only on high tier.
4. **Per-feature splitting:** cart drawer, checkout form, collections grid loaded on demand.
5. **Import hygiene:** `import { X } from 'three'` named imports only, avoid `three/examples` unless needed, check `@next/bundle-analyzer` every PR.
6. **Budgets:** initial JS < 170 KB gz, 3D chunk < 250 KB gz, per-route CSS < 20 KB gz. Fail CI if exceeded.
7. **Prefetch smartly:** prefetch the 3D chunk on idle (`requestIdleCallback`) after hero text paints.

## 2. Loading & rendering

- Hero text + skeleton paint first (SSR), canvas fades in when textures ready.
- Preload only the first 3 garment textures; lazy-load the rest by proximity to the active index.
- Fonts: `next/font` self-hosted, `display: swap`, subset to Latin, preload Anton only.
- Images: `next/image`, AVIF/WebP, explicit width/height (no CLS), `priority` only on LCP image.
- Cache headers: `public, max-age=31536000, immutable` for hashed assets; short for HTML.
- Brotli compression at CDN/server; HTTP/2 or HTTP/3.

## 3. 3D performance (works on every system)

- `dpr={[1, quality.maxDpr]}`; mobile cap 1.25, desktop 2.
- `frameloop="demand"` when idle, `invalidate()` on interaction; continuous only while wind/animation active.
- Pause rendering when tab hidden (`visibilitychange`) and when canvas is off-screen (`IntersectionObserver`).
- `PerformanceMonitor` + `AdaptiveDpr` for live downgrade; manual tier from `detect-gpu`.
- Textures: ≤ 1024px on mobile, mipmaps on (needed for blur trick), `anisotropy` ≤ 4, KTX2 where possible.
- Reuse geometries/materials (single `PlaneGeometry`, shared shader material with uniforms per instance).
- Dispose textures/materials on unmount; no per-frame allocations (reuse vectors).
- Avoid: shadow maps, real-time reflections, full-screen post-processing on medium/low.
- Fallback: no WebGL / low tier / `Save-Data` / `prefers-reduced-motion` → static 2D version with CSS transforms.
- Handle `webglcontextlost` / `restored` gracefully.

## 4. Core Web Vitals targets

LCP < 2.5s · INP < 200ms · CLS < 0.1 · Lighthouse mobile ≥ 90 · 30 fps floor in interaction.

## 5. Security

### Headers (`next.config.js` / middleware)
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{random}' 'strict-dynamic'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; worker-src 'self' blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(self)
Cross-Origin-Opener-Policy: same-origin
```
(Add payment provider domains to CSP when gateway is added.)

### Application
- **Validate everything** with Zod on client and server (forms, API routes, query params).
- **Never trust the client for prices:** server recomputes totals from product IDs; cart in `localStorage` holds IDs/qty only.
- **XSS:** no `dangerouslySetInnerHTML`; React escapes by default; sanitise any CMS HTML (DOMPurify).
- **CSRF:** SameSite cookies + origin check on state-changing routes.
- **Rate limiting:** on checkout/contact/API routes (Upstash free tier or middleware limiter).
- **Cookies (when auth arrives):** `HttpOnly; Secure; SameSite=Lax`.
- **Secrets:** only in server env vars, never `NEXT_PUBLIC_` for secrets; `.env*` in `.gitignore`.
- **Errors:** generic messages to users, details only in server logs.
- **Payments (later):** hosted/tokenised checkout only (no card data touches our server), verify webhook signatures, idempotency keys, amount check server-side.
- **PII:** collect minimum (name, phone, address), no logging of personal data.

### Supply chain
- Commit lockfile, pin versions, `pnpm audit` in CI, Dependabot/Renovate.
- Only trusted packages; review new deps' size and maintenance.
- Self-host fonts/scripts (no third-party CDNs → no SRI headaches, no tracking).
- Enable GitHub secret scanning and 2FA on all accounts.

### Hardening checklist before launch
- [ ] Securityheaders.com grade A
- [ ] CSP has no `unsafe-eval`, nonce works
- [ ] `pnpm audit` clean (no high/critical)
- [ ] No secrets in repo/bundle (`grep` build output)
- [ ] Rate limits tested
- [ ] Source maps not publicly served
- [ ] Robots/sitemap correct, 404/500 pages don't leak stack traces

## 6. Test checklist

- [ ] Real ~₹10k Android (Chrome) and an older iPhone: fps, heat, memory
- [ ] Chrome DevTools throttling: 4× CPU, Fast 3G
- [ ] Lighthouse mobile + WebPageTest
- [ ] WebGL disabled → fallback works
- [ ] `prefers-reduced-motion` honoured
- [ ] Keyboard-only navigation, screen reader pass
- [ ] Tab hidden / return: no memory growth, no jank
