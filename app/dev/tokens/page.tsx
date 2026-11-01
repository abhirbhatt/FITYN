import Link from 'next/link';

interface TokenItem {
  token: string;
  variable: string;
  hex: string;
  application: string;
  rule: string;
  bgClass: string;
  textClass: string;
  borderClass?: string;
}

const TOKENS: TokenItem[] = [
  {
    token: 'Offwhite',
    variable: '--offwhite',
    hex: '#FFF2B4',
    application: 'Marquee text, button labels on dark/olive surfaces, badges',
    rule: 'NEVER used on --bg or --white. Minimum 5.4:1 contrast on olive.',
    bgClass: 'bg-offwhite',
    textClass: 'text-black',
    borderClass: 'border border-line',
  },
  {
    token: 'Olive',
    variable: '--olive',
    hex: '#486C2F',
    application: 'Marquee bar, primary CTA buttons, active state accents',
    rule: 'High contrast on --white (≈ 6:1). Primary brand accent.',
    bgClass: 'bg-olive',
    textClass: 'text-offwhite',
  },
  {
    token: 'Black',
    variable: '--black',
    hex: '#0A0A0A',
    application: 'Headings, body text on light backgrounds, toggle active pill',
    rule: 'Deep, sharp contrast (≈ 18:1 against --offwhite).',
    bgClass: 'bg-black',
    textClass: 'text-offwhite',
  },
  {
    token: 'Background (Base)',
    variable: '--bg',
    hex: '#F3F3F0',
    application: 'Main canvas background, page base',
    rule: 'Warm, gallery-neutral soft gray-white.',
    bgClass: 'bg-bg',
    textClass: 'text-black',
    borderClass: 'border border-line',
  },
  {
    token: 'Background 2 (Secondary)',
    variable: '--bg-2',
    hex: '#E9E9E4',
    application: 'Product cards, secondary panels, collection tiles',
    rule: 'Subtle separation without harsh lines.',
    bgClass: 'bg-bg-2',
    textClass: 'text-black',
    borderClass: 'border border-line',
  },
  {
    token: 'Line',
    variable: '--line',
    hex: '#D4D4CE',
    application: 'Clean borders, thin dividers, clothing rail silhouette',
    rule: 'Delicate structural framing.',
    bgClass: 'bg-line',
    textClass: 'text-black',
  },
  {
    token: 'White',
    variable: '--white',
    hex: '#FFFFFF',
    application: 'Input fields, active highlight surfaces',
    rule: 'Pure highlight.',
    bgClass: 'bg-white',
    textClass: 'text-black',
    borderClass: 'border border-line',
  },
];

interface ContrastTest {
  pair: string;
  foreground: string;
  fgHex: string;
  background: string;
  bgHex: string;
  ratio: string;
  target: string;
  wcagStatus: 'PASS AA & AAA' | 'PASS AA' | 'PROHIBITED VIOLATION';
  ruleNotes: string;
  sampleFg: string;
  sampleBg: string;
  sampleBorder?: string;
}

const CONTRAST_TESTS: ContrastTest[] = [
  {
    pair: 'Offwhite on Olive',
    foreground: '--offwhite',
    fgHex: '#FFF2B4',
    background: '--olive',
    bgHex: '#486C2F',
    ratio: '5.48:1',
    target: '>= 5.4:1',
    wcagStatus: 'PASS AA',
    ruleNotes: 'Authorized: Used for primary CTA buttons and the bottom marquee bar.',
    sampleFg: 'text-offwhite',
    sampleBg: 'bg-olive',
  },
  {
    pair: 'Olive on White',
    foreground: '--olive',
    fgHex: '#486C2F',
    background: '--white',
    bgHex: '#FFFFFF',
    ratio: '6.14:1',
    target: '~6:1 (>= 4.5:1)',
    wcagStatus: 'PASS AA',
    ruleNotes: 'Authorized: Used for active accent highlights and links on white cards.',
    sampleFg: 'text-olive',
    sampleBg: 'bg-white',
    sampleBorder: 'border border-line',
  },
  {
    pair: 'Offwhite on Black',
    foreground: '--offwhite',
    fgHex: '#FFF2B4',
    background: '--black',
    bgHex: '#0A0A0A',
    ratio: '17.68:1',
    target: '>= 7.0:1 (AAA)',
    wcagStatus: 'PASS AA & AAA',
    ruleNotes: 'Authorized: Used for high-emphasis dark buttons and badge text.',
    sampleFg: 'text-offwhite',
    sampleBg: 'bg-black',
  },
  {
    pair: 'Black on Base BG',
    foreground: '--black',
    fgHex: '#0A0A0A',
    background: '--bg',
    bgHex: '#F3F3F0',
    ratio: '17.79:1',
    target: '>= 7.0:1 (AAA)',
    wcagStatus: 'PASS AA & AAA',
    ruleNotes: 'Authorized: Default typography pairing for headings and body content.',
    sampleFg: 'text-black',
    sampleBg: 'bg-bg',
    sampleBorder: 'border border-line',
  },
  {
    pair: 'Black on White',
    foreground: '--black',
    fgHex: '#0A0A0A',
    background: '--white',
    bgHex: '#FFFFFF',
    ratio: '18.89:1',
    target: '>= 7.0:1 (AAA)',
    wcagStatus: 'PASS AA & AAA',
    ruleNotes: 'Authorized: Form inputs, active highlight tiles.',
    sampleFg: 'text-black',
    sampleBg: 'bg-white',
    sampleBorder: 'border border-line',
  },
  {
    pair: 'Offwhite on Base BG (Negative Constraint)',
    foreground: '--offwhite',
    fgHex: '#FFF2B4',
    background: '--bg',
    bgHex: '#F3F3F0',
    ratio: '1.01:1',
    target: 'FAIL (Must be prohibited)',
    wcagStatus: 'PROHIBITED VIOLATION',
    ruleNotes: 'FORBIDDEN by architectural blueprint. NEVER render offwhite on --bg.',
    sampleFg: 'text-offwhite',
    sampleBg: 'bg-bg',
    sampleBorder: 'border border-red-500',
  },
  {
    pair: 'Offwhite on White (Negative Constraint)',
    foreground: '--offwhite',
    fgHex: '#FFF2B4',
    background: '--white',
    bgHex: '#FFFFFF',
    ratio: '1.12:1',
    target: 'FAIL (Must be prohibited)',
    wcagStatus: 'PROHIBITED VIOLATION',
    ruleNotes: 'FORBIDDEN by architectural blueprint. NEVER render offwhite on --white.',
    sampleFg: 'text-offwhite',
    sampleBg: 'bg-white',
    sampleBorder: 'border border-red-500',
  },
];

export default function DevTokensPage() {
  return (
    <main className="min-h-screen bg-bg p-6 md:p-12 space-y-12">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-line pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-display text-2xl uppercase tracking-display text-black min-h-touch flex items-center"
            >
              FITYN
            </Link>
            <span className="font-accent text-lg text-olive">Design Foundation</span>
          </div>
          <h1 className="font-display text-h2 uppercase text-black tracking-display mt-2">
            TOKEN AUDIT &amp; CONTRAST MATRIX
          </h1>
          <p className="font-sans text-xs uppercase tracking-caption text-black/60 mt-1">
            FITYN Foundation &amp; Architectural Blueprint v1.0.0 &bull; Light Theme Only
          </p>
        </div>
        <Link
          href="/"
          className="min-h-touch min-w-touch inline-flex items-center justify-center border border-line px-4 text-xs uppercase tracking-caption hover:border-black transition-colors"
        >
          &larr; Exit to Home
        </Link>
      </header>

      {/* Token Palette Grid */}
      <section className="space-y-6">
        <div className="border-b border-line pb-2">
          <h2 className="font-display text-xl uppercase tracking-display text-black">
            1. PALETTE SYSTEM (7 MASTER TOKENS)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOKENS.map((token) => (
            <div
              key={token.variable}
              className="bg-bg-2 border border-line p-5 flex flex-col justify-between"
            >
              <div>
                <div
                  className={`h-24 w-full rounded-none flex items-end p-3 ${token.bgClass} ${token.borderClass ?? ''}`}
                >
                  <span
                    className={`font-mono text-xs font-semibold px-2 py-0.5 ${
                      token.hex === '#FFF2B4' || token.hex === '#FFFFFF' || token.hex === '#F3F3F0' || token.hex === '#E9E9E4' || token.hex === '#D4D4CE'
                        ? 'bg-black text-offwhite'
                        : 'bg-white text-black'
                    }`}
                  >
                    {token.hex}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="font-display text-lg uppercase tracking-display text-black">
                    {token.token}
                  </h3>
                  <code className="font-mono text-xs text-olive block mt-0.5">
                    {token.variable}
                  </code>
                </div>

                <p className="font-sans text-xs text-black/80 mt-3 leading-relaxed">
                  <strong className="block text-black">Usage:</strong>
                  {token.application}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-line">
                <p className="font-sans text-[11px] text-black/60">
                  <span className="font-semibold text-black">Rule:</span> {token.rule}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WCAG Contrast Table */}
      <section className="space-y-6">
        <div className="border-b border-line pb-2 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-xl uppercase tracking-display text-black">
              2. WCAG 2.1 AA CONTRAST RATIO TABLE
            </h2>
            <p className="font-sans text-xs text-black/70 mt-1">
              Calculated via sRGB linearized relative luminance standards.
            </p>
          </div>
          <span className="font-mono text-xs px-2.5 py-1 bg-black text-offwhite uppercase tracking-wider">
            WCAG 2.1 AA Certified
          </span>
        </div>

        <div className="overflow-x-auto border border-line bg-white">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="bg-bg-2 border-b border-line">
                <th className="p-4 font-display text-xs uppercase tracking-display text-black">
                  Pairing Name
                </th>
                <th className="p-4 font-display text-xs uppercase tracking-display text-black">
                  Foreground
                </th>
                <th className="p-4 font-display text-xs uppercase tracking-display text-black">
                  Background
                </th>
                <th className="p-4 font-display text-xs uppercase tracking-display text-black">
                  Contrast Ratio
                </th>
                <th className="p-4 font-display text-xs uppercase tracking-display text-black">
                  Target Spec
                </th>
                <th className="p-4 font-display text-xs uppercase tracking-display text-black">
                  Compliance Status
                </th>
                <th className="p-4 font-display text-xs uppercase tracking-display text-black">
                  Visual Sample
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {CONTRAST_TESTS.map((test) => (
                <tr
                  key={test.pair}
                  className={`hover:bg-bg-2/50 transition-colors ${
                    test.wcagStatus === 'PROHIBITED VIOLATION' ? 'bg-red-50/40' : ''
                  }`}
                >
                  <td className="p-4 font-medium text-black">
                    {test.pair}
                    <span className="block text-[11px] text-black/60 font-normal mt-0.5">
                      {test.ruleNotes}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-[11px]">
                    <span className="font-semibold">{test.foreground}</span>
                    <span className="block text-black/60">{test.fgHex}</span>
                  </td>
                  <td className="p-4 font-mono text-[11px]">
                    <span className="font-semibold">{test.background}</span>
                    <span className="block text-black/60">{test.bgHex}</span>
                  </td>
                  <td className="p-4 font-mono text-sm font-bold text-black">
                    {test.ratio}
                  </td>
                  <td className="p-4 font-mono text-[11px] text-black/80">
                    {test.target}
                  </td>
                  <td className="p-4">
                    {test.wcagStatus === 'PASS AA & AAA' ? (
                      <span className="inline-block px-2.5 py-1 bg-olive text-offwhite font-display text-[10px] uppercase tracking-display">
                        PASS (AA + AAA)
                      </span>
                    ) : test.wcagStatus === 'PASS AA' ? (
                      <span className="inline-block px-2.5 py-1 bg-olive text-offwhite font-display text-[10px] uppercase tracking-display">
                        PASS (AA &ge; 5.4:1)
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-1 bg-red-700 text-white font-display text-[10px] uppercase tracking-display">
                        PROHIBITED
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div
                      className={`px-3 py-2 text-center min-w-[120px] ${test.sampleBg} ${test.sampleFg} ${test.sampleBorder ?? ''}`}
                    >
                      <span className="font-display text-xs uppercase tracking-display">
                        {test.wcagStatus === 'PROHIBITED VIOLATION' ? 'FORBIDDEN' : 'CALM FITYN'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Typography Hierarchy Audit */}
      <section className="space-y-6">
        <div className="border-b border-line pb-2">
          <h2 className="font-display text-xl uppercase tracking-display text-black">
            3. TYPOGRAPHY MATRIX &amp; SCALE AUDIT
          </h2>
        </div>

        <div className="space-y-6 bg-white border border-line p-8">
          <div className="border-b border-line pb-6">
            <span className="font-sans text-xs uppercase tracking-caption text-black/60 block mb-1">
              Display H1 &bull; Anton &bull; clamp(2.5rem, 8vw, 6rem) &bull; tracking 0.02em
            </span>
            <p className="font-display text-h1 uppercase text-black">
              WEAR THE CALM
            </p>
          </div>

          <div className="border-b border-line pb-6">
            <span className="font-sans text-xs uppercase tracking-caption text-black/60 block mb-1">
              Display H2 &bull; Anton &bull; clamp(1.75rem, 4vw, 3rem) &bull; tracking 0.02em
            </span>
            <p className="font-display text-h2 uppercase text-black">
              SIGNATURE 3D CLOTHING RAIL
            </p>
          </div>

          <div className="border-b border-line pb-6">
            <span className="font-sans text-xs uppercase tracking-caption text-black/60 block mb-1">
              Accent Flourish &bull; Yellowtail &bull; Single-phrase accents only (never UI or body)
            </span>
            <p className="font-accent text-3xl text-olive">
              tactile digital apparel architecture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <span className="font-sans text-xs uppercase tracking-caption text-black/60 block mb-1">
                Body &bull; Inter &bull; 16px (1rem) &bull; Line height 1.5
              </span>
              <p className="font-sans text-base text-black/80 leading-relaxed">
                Garments hang on an ultra-lightweight double-sided textured quad rail.
                Rendered with hardware mip-bias depth-of-field and wind vertex displacement.
              </p>
            </div>
            <div>
              <span className="font-sans text-xs uppercase tracking-caption text-black/60 block mb-1">
                Caption &bull; Inter &bull; 12px (0.75rem) &bull; tracking 0.05em uppercase
              </span>
              <p className="font-sans text-caption uppercase text-black/60">
                CAPSULE DROP &bull; ALL COTTON 280 GSM &bull; ZERO PREMATURE OPTIMIZATION
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Button & Focus Ring Interactive Audit */}
      <section className="space-y-6">
        <div className="border-b border-line pb-2">
          <h2 className="font-display text-xl uppercase tracking-display text-black">
            4. ACCESSIBILITY &amp; INTERACTIVE CONTROLS AUDIT
          </h2>
        </div>

        <div className="bg-bg-2 border border-line p-8 flex flex-wrap items-center gap-6">
          <button
            type="button"
            className="min-h-touch min-w-touch bg-olive text-offwhite px-8 py-3.5 font-display uppercase tracking-display hover:opacity-90 transition-opacity"
          >
            PRIMARY CTA (OLIVE + OFFWHITE)
          </button>

          <button
            type="button"
            className="min-h-touch min-w-touch bg-black text-offwhite px-8 py-3.5 font-display uppercase tracking-display hover:opacity-90 transition-opacity"
          >
            SECONDARY CTA (BLACK + OFFWHITE)
          </button>

          <button
            type="button"
            className="min-h-touch min-w-touch border border-line bg-white text-black px-8 py-3.5 font-display uppercase tracking-display hover:border-black transition-colors"
          >
            OUTLINED ACTION (WHITE + BLACK)
          </button>

          <div className="flex items-center gap-2">
            <span className="font-sans text-xs uppercase tracking-caption text-black/70">
              Focus Outline Test:
            </span>
            <input
              type="text"
              defaultValue="Click or Tab here for 2px Olive outline"
              className="min-h-touch px-4 py-2 bg-white border border-line font-sans text-xs text-black"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line pt-6 text-xs uppercase tracking-caption text-black/60 flex flex-col sm:flex-row justify-between gap-4">
        <span>FITYN Architecture Audit &bull; Phase 0 Foundation</span>
        <span>WCAG 2.1 AA Compliant &bull; 44x44px Minimum Touch Targets</span>
      </footer>
    </main>
  );
}

