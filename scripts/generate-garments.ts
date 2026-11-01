import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

interface ArchetypeDef {
  key: 'tank-top' | 'oversized-tee' | 'hoodie' | 'bomber-jacket' | 'cap';
  name: string;
  variants: Array<{
    variantKey: string;
    colourName: string;
    primaryHex: string;
    accentHex: string;
    detailHex: string;
  }>;
}

const ARCHETYPES: ArchetypeDef[] = [
  {
    key: 'tank-top',
    name: 'Raw Hem Tank',
    variants: [
      {
        variantKey: 'slate',
        colourName: 'Washed Slate',
        primaryHex: '#2A3036',
        accentHex: '#3D464E',
        detailHex: '#8E9AA4',
      },
      {
        variantKey: 'bone',
        colourName: 'Bone Chalk',
        primaryHex: '#D5D4CB',
        accentHex: '#C5C4BA',
        detailHex: '#4A4A45',
      },
    ],
  },
  {
    key: 'oversized-tee',
    name: 'Heavyweight Boxy Tee',
    variants: [
      {
        variantKey: 'onyx',
        colourName: 'Onyx Black',
        primaryHex: '#141416',
        accentHex: '#222326',
        detailHex: '#E5E5DE',
      },
      {
        variantKey: 'olive',
        colourName: 'Washed Olive',
        primaryHex: '#486C2F',
        accentHex: '#3A5726',
        detailHex: '#FFF2B4',
      },
    ],
  },
  {
    key: 'hoodie',
    name: 'Heavy Fleece Hoodie',
    variants: [
      {
        variantKey: 'charcoal',
        colourName: 'Deep Charcoal',
        primaryHex: '#1C1D21',
        accentHex: '#292B30',
        detailHex: '#9DA3AA',
      },
      {
        variantKey: 'chalk',
        colourName: 'Chalk White',
        primaryHex: '#E2E1DA',
        accentHex: '#CECCC4',
        detailHex: '#2A2C30',
      },
    ],
  },
  {
    key: 'bomber-jacket',
    name: 'Twill Bomber Jacket',
    variants: [
      {
        variantKey: 'tactical-olive',
        colourName: 'Tactical Olive',
        primaryHex: '#3C4E2C',
        accentHex: '#252F1C',
        detailHex: '#B2C49F',
      },
      {
        variantKey: 'pitch-black',
        colourName: 'Pitch Black',
        primaryHex: '#0E0F12',
        accentHex: '#1C1D22',
        detailHex: '#D4D6DC',
      },
    ],
  },
  {
    key: 'cap',
    name: '6-Panel Unstructured Cap',
    variants: [
      {
        variantKey: 'black',
        colourName: 'Onyx Black',
        primaryHex: '#121316',
        accentHex: '#212328',
        detailHex: '#78828C',
      },
      {
        variantKey: 'stone',
        colourName: 'Raw Stone',
        primaryHex: '#C5C3BA',
        accentHex: '#B2B0A6',
        detailHex: '#313336',
      },
    ],
  },
];

// SVG Builders for each garment archetype
function renderTankTopSvg(
  primary: string,
  accent: string,
  detail: string,
  isBack: boolean,
): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.12"/>
    </filter>
  </defs>

  <!-- Hanger Hook & Body -->
  <g stroke="#7A7A74" stroke-width="6" fill="none" stroke-linecap="round">
    <path d="M 512,60 C 512,30 534,18 548,32 C 562,46 544,72 512,96 L 512,140" />
    <path d="M 330,178 L 512,140 L 694,178" stroke-width="8" stroke="#8E8E88" />
  </g>

  <!-- Garment Main Body -->
  <g filter="url(#shadow)">
    <!-- Tank Cutout -->
    <path d="M 370,165 
             C 410,185 450,195 512,195 
             C 574,195 614,185 654,165 
             L 692,230 
             C 650,290 626,380 626,450 
             L 634,840 
             C 634,855 620,865 605,865 
             L 419,865 
             C 404,865 390,855 390,840 
             L 398,450 
             C 398,380 374,290 332,230 
             Z" 
          fill="${primary}" 
          stroke="${accent}" 
          stroke-width="4" />

    <!-- Neckline Inner Cutout -->
    <path d="M 430,172 
             C 460,${isBack ? '210' : '265'} 512,${isBack ? '215' : '270'} 512,${isBack ? '215' : '270'} 
             C 512,${isBack ? '215' : '270'} 564,${isBack ? '210' : '265'} 594,172 
             C 564,188 538,195 512,195 
             C 486,195 460,188 430,172 Z" 
          fill="${accent}" opacity="0.35" />

    <!-- Binding Rib Details -->
    <path d="M 430,172 C 460,${isBack ? '210' : '265'} 564,${isBack ? '210' : '265'} 594,172" 
          fill="none" stroke="${accent}" stroke-width="4" />
    <path d="M 390,855 L 634,855" fill="none" stroke="${accent}" stroke-width="3" />
    <path d="M 406,460 L 406,845" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="4 4" />
    <path d="M 618,460 L 618,845" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="4 4" />

    ${isBack
      ? `
      <!-- Back Graphic (Minimal Architectural Monolith) -->
      <g transform="translate(512, 440)" text-anchor="middle">
        <rect x="-110" y="-120" width="220" height="280" fill="none" stroke="${detail}" stroke-width="3" opacity="0.85"/>
        <line x1="-110" y1="80" x2="110" y2="80" stroke="${detail}" stroke-width="2" opacity="0.85"/>
        <text x="0" y="-40" font-family="sans-serif" font-weight="900" font-size="28" fill="${detail}" letter-spacing="4">FITYN</text>
        <text x="0" y="0" font-family="sans-serif" font-weight="400" font-size="12" fill="${detail}" letter-spacing="2">RAW SILHOUETTE 01</text>
        <text x="0" y="30" font-family="monospace" font-size="11" fill="${detail}" opacity="0.75">CALM / ARCHIVE</text>
        <text x="0" y="115" font-family="sans-serif" font-weight="600" font-size="10" fill="${detail}" letter-spacing="3">EDITION 001 / 100</text>
      </g>
    `
      : `
      <!-- Front Subtle Minimal Brand Stamp -->
      <g transform="translate(512, 380)" text-anchor="middle">
        <circle cx="0" cy="0" r="16" fill="none" stroke="${detail}" stroke-width="2.5" opacity="0.8"/>
        <text x="0" y="4" font-family="sans-serif" font-weight="800" font-size="10" fill="${detail}">F</text>
        <text x="0" y="34" font-family="sans-serif" font-weight="600" font-size="9" fill="${detail}" letter-spacing="2">WEAR THE CALM</text>
      </g>
    `
    }
  </g>
</svg>`;
}

function renderOversizedTeeSvg(
  primary: string,
  accent: string,
  detail: string,
  isBack: boolean,
): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.14"/>
    </filter>
  </defs>

  <!-- Hanger Hook & Silhouette -->
  <g stroke="#7A7A74" stroke-width="6" fill="none" stroke-linecap="round">
    <path d="M 512,60 C 512,30 534,18 548,32 C 562,46 544,72 512,96 L 512,140" />
    <path d="M 280,188 L 512,140 L 744,188" stroke-width="8" stroke="#8E8E88" />
  </g>

  <!-- Garment Plane -->
  <g filter="url(#shadow)">
    <!-- Boxy Tee Outline -->
    <path d="M 436,155 
             C 470,${isBack ? '165' : '185'} 512,${isBack ? '168' : '188'} 512,${isBack ? '168' : '188'} 
             C 512,${isBack ? '168' : '188'} 554,${isBack ? '165' : '185'} 588,155 
             L 778,212 
             L 746,430 
             L 668,396 
             L 674,845 
             C 674,858 662,868 648,868 
             L 376,868 
             C 362,868 350,858 350,845 
             L 356,396 
             L 278,430 
             L 246,212 
             Z" 
          fill="${primary}" 
          stroke="${accent}" 
          stroke-width="4" />

    <!-- Ribbed Collar -->
    <path d="M 436,155 C 470,${isBack ? '165' : '185'} 554,${isBack ? '165' : '185'} 588,155 C 570,146 454,146 436,155 Z" 
          fill="${accent}" opacity="0.45" />

    <!-- Dropped Sleeve Seams -->
    <line x1="334" y1="238" x2="356" y2="396" stroke="${accent}" stroke-width="3" />
    <line x1="690" y1="238" x2="668" y2="396" stroke="${accent}" stroke-width="3" />

    <!-- Sleeve Cuffs & Hem Double Stitches -->
    <line x1="250" y1="416" x2="278" y2="430" stroke="${accent}" stroke-width="2.5" />
    <line x1="774" y1="416" x2="746" y2="430" stroke="${accent}" stroke-width="2.5" />
    <line x1="352" y1="856" x2="672" y2="856" stroke="${accent}" stroke-width="3" />

    ${isBack
      ? `
      <!-- Back Poster Print (Architectural Typographic Composition) -->
      <g transform="translate(512, 490)" text-anchor="middle">
        <rect x="-140" y="-180" width="280" height="340" fill="none" stroke="${detail}" stroke-width="3.5" opacity="0.85"/>
        <line x1="-140" y1="-120" x2="140" y2="-120" stroke="${detail}" stroke-width="2" opacity="0.85"/>
        <text x="0" y="-140" font-family="Impact, sans-serif" font-size="28" fill="${detail}" letter-spacing="4">F I T Y N</text>
        <text x="0" y="-60" font-family="sans-serif" font-weight="900" font-size="44" fill="${detail}" letter-spacing="2">WEAR</text>
        <text x="0" y="-10" font-family="sans-serif" font-weight="900" font-size="44" fill="${detail}" letter-spacing="2">THE</text>
        <text x="0" y="40" font-family="sans-serif" font-weight="900" font-size="44" fill="${detail}" letter-spacing="2">CALM</text>
        <line x1="-140" y1="70" x2="140" y2="70" stroke="${detail}" stroke-width="2" opacity="0.85"/>
        <text x="0" y="105" font-family="monospace" font-size="12" fill="${detail}" opacity="0.85">HEAVYWEIGHT 280 GSM</text>
        <text x="0" y="132" font-family="monospace" font-size="10" fill="${detail}" opacity="0.7">100% COMBED COTTON // BENGALURU</text>
      </g>
    `
      : `
      <!-- Front Pocket / Chest Minimal Identifier -->
      <g transform="translate(420, 310)">
        <rect x="-35" y="-14" width="70" height="28" fill="none" stroke="${detail}" stroke-width="2" opacity="0.85"/>
        <text x="0" y="4" text-anchor="middle" font-family="Impact, sans-serif" font-size="14" fill="${detail}" letter-spacing="2">FITYN</text>
      </g>
    `
    }
  </g>
</svg>`;
}

function renderHoodieSvg(
  primary: string,
  accent: string,
  detail: string,
  isBack: boolean,
): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.16"/>
    </filter>
  </defs>

  <!-- Hanger Hook -->
  <g stroke="#7A7A74" stroke-width="6" fill="none" stroke-linecap="round">
    <path d="M 512,60 C 512,30 534,18 548,32 C 562,46 544,72 512,96 L 512,130" />
    <path d="M 280,188 L 512,130 L 744,188" stroke-width="8" stroke="#8E8E88" />
  </g>

  <!-- Garment Plane -->
  <g filter="url(#shadow)">
    <!-- Main Hoodie Torso & Sleeves -->
    <path d="M 410,180 
             L 770,230 
             L 736,560 
             L 668,520 
             L 670,830 
             C 670,844 658,854 644,854 
             L 380,854 
             C 366,854 354,844 354,830 
             L 356,520 
             L 288,560 
             L 254,230 
             Z" 
          fill="${primary}" 
          stroke="${accent}" 
          stroke-width="4" />

    <!-- Heavy Draped Hood -->
    <path d="M 374,185 
             C 380,110 440,90 512,90 
             C 584,90 644,110 650,185 
             C 620,240 580,260 512,260 
             C 444,260 404,240 374,185 Z" 
          fill="${primary}" 
          stroke="${accent}" 
          stroke-width="4" />

    <!-- Hood Inner Depth Cavity -->
    <path d="M 424,185 
             C 440,140 480,130 512,130 
             C 544,130 584,140 600,185 
             C 580,225 544,235 512,235 
             C 480,235 444,225 424,185 Z" 
          fill="${accent}" opacity="0.45" />

    ${!isBack
      ? `
      <!-- Front Drawstrings -->
      <line x1="482" y1="245" x2="480" y2="340" stroke="${detail}" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
      <circle cx="480" cy="344" r="3" fill="${detail}" opacity="0.8"/>
      <line x1="542" y1="245" x2="544" y2="335" stroke="${detail}" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
      <circle cx="544" cy="339" r="3" fill="${detail}" opacity="0.8"/>

      <!-- Kangaroo Pocket -->
      <path d="M 416,560 
               L 444,520 
               L 580,520 
               L 608,560 
               L 608,740 
               L 416,740 
               Z" 
            fill="${primary}" 
            stroke="${accent}" 
            stroke-width="3.5" />
      <line x1="416" y1="560" x2="444" y2="520" stroke="${accent}" stroke-width="3" />
      <line x1="608" y1="560" x2="580" y2="520" stroke="${accent}" stroke-width="3" />

      <!-- Minimal Chest Stamp -->
      <g transform="translate(512, 380)" text-anchor="middle">
        <text x="0" y="0" font-family="Impact, sans-serif" font-size="20" fill="${detail}" letter-spacing="3">FITYN</text>
        <text x="0" y="20" font-family="sans-serif" font-size="9" font-weight="600" fill="${detail}" letter-spacing="2">420 GSM FLEECE</text>
      </g>
    `
      : `
      <!-- Back Bold Editorial Monolith -->
      <g transform="translate(512, 510)" text-anchor="middle">
        <rect x="-135" y="-170" width="270" height="300" fill="none" stroke="${detail}" stroke-width="3" opacity="0.9"/>
        <text x="0" y="-115" font-family="Impact, sans-serif" font-size="34" fill="${detail}" letter-spacing="4">WEAR THE CALM</text>
        <line x1="-110" y1="-85" x2="110" y2="-85" stroke="${detail}" stroke-width="1.5" opacity="0.7"/>
        <text x="0" y="-35" font-family="sans-serif" font-weight="800" font-size="14" fill="${detail}" letter-spacing="3">FITYN TECHNICAL APPAREL</text>
        <text x="0" y="0" font-family="monospace" font-size="11" fill="${detail}" opacity="0.75">BATCH // FIT-003</text>
        <text x="0" y="45" font-family="monospace" font-size="10" fill="${detail}" opacity="0.65">DOUBLE-LAYERED STRUCTURED HOOD</text>
        <text x="0" y="90" font-family="sans-serif" font-weight="600" font-size="11" fill="${detail}" letter-spacing="4">&#8226; RESTFUL UTILITY &#8226;</text>
      </g>
    `
    }

    <!-- Ribbed Hem & Cuffs -->
    <line x1="356" y1="838" x2="668" y2="838" stroke="${accent}" stroke-width="3" />
    <line x1="264" y1="545" x2="288" y2="560" stroke="${accent}" stroke-width="3" />
    <line x1="760" y1="545" x2="736" y2="560" stroke="${accent}" stroke-width="3" />
  </g>
</svg>`;
}

function renderBomberJacketSvg(
  primary: string,
  accent: string,
  detail: string,
  isBack: boolean,
): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.18"/>
    </filter>
  </defs>

  <!-- Hanger Hook -->
  <g stroke="#7A7A74" stroke-width="6" fill="none" stroke-linecap="round">
    <path d="M 512,60 C 512,30 534,18 548,32 C 562,46 544,72 512,96 L 512,135" />
    <path d="M 270,195 L 512,135 L 754,195" stroke-width="8" stroke="#8E8E88" />
  </g>

  <!-- Garment Plane -->
  <g filter="url(#shadow)">
    <!-- Bomber Silhouette -->
    <path d="M 440,165 
             C 475,180 549,180 584,165 
             L 768,225 
             L 730,550 
             L 666,515 
             L 666,800 
             C 666,816 652,828 636,828 
             L 388,828 
             C 372,828 358,816 358,800 
             L 358,515 
             L 294,550 
             L 256,225 
             Z" 
          fill="${primary}" 
          stroke="${accent}" 
          stroke-width="4" />

    <!-- Ribbed Baseball Collar -->
    <path d="M 440,165 C 475,186 549,186 584,165 C 568,152 456,152 440,165 Z" 
          fill="${accent}" stroke="${primary}" stroke-width="2" />

    <!-- Ribbed Cuffs and Hem -->
    <line x1="360" y1="812" x2="664" y2="812" stroke="${accent}" stroke-width="4" />
    <line x1="266" y1="535" x2="294" y2="550" stroke="${accent}" stroke-width="3" />
    <line x1="758" y1="535" x2="730" y2="550" stroke="${accent}" stroke-width="3" />

    ${!isBack
      ? `
      <!-- Heavy Center Zipper -->
      <line x1="512" y1="184" x2="512" y2="812" stroke="${detail}" stroke-width="5" stroke-linecap="square"/>
      <rect x="506" y="270" width="12" height="18" fill="${detail}" rx="2"/>

      <!-- Angular Front Welt Pockets -->
      <line x1="410" y1="580" x2="455" y2="650" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>
      <line x1="614" y1="580" x2="569" y2="650" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>

      <!-- Left Sleeve Flight Utility Pocket -->
      <g transform="translate(276, 360)">
        <rect x="0" y="0" width="28" height="46" fill="${primary}" stroke="${accent}" stroke-width="3" rx="3"/>
        <line x1="0" y1="12" x2="28" y2="12" stroke="${detail}" stroke-width="2.5"/>
        <line x1="14" y1="46" x2="14" y2="76" stroke="#9E2A2B" stroke-width="4"/> <!-- Iconic red flight ribbon accent -->
      </g>

      <!-- Minimal Chest ID -->
      <g transform="translate(425, 290)">
        <text x="0" y="0" font-family="monospace" font-size="11" font-weight="700" fill="${detail}" letter-spacing="2">FIT // BOMBER</text>
      </g>
    `
      : `
      <!-- Back Clean Architecture Panel -->
      <line x1="375" y1="310" x2="649" y2="310" stroke="${accent}" stroke-width="3" />
      <g transform="translate(512, 460)" text-anchor="middle">
        <text x="0" y="-80" font-family="Impact, sans-serif" font-size="42" fill="${detail}" letter-spacing="5">F I T Y N</text>
        <text x="0" y="-30" font-family="sans-serif" font-weight="700" font-size="13" fill="${detail}" letter-spacing="4">ARCHITECTURAL FLIGHTWEAR</text>
        <rect x="-120" y="10" width="240" height="90" fill="none" stroke="${detail}" stroke-width="2" opacity="0.8"/>
        <text x="0" y="42" font-family="monospace" font-size="11" fill="${detail}">SPEC: TWILL SHELL / WATER RESIST</text>
        <text x="0" y="70" font-family="monospace" font-size="10" fill="${detail}" opacity="0.75">CALM MOVEMENT &#8226; SERIES 01</text>
      </g>
    `
    }
  </g>
</svg>`;
}

function renderCapSvg(
  primary: string,
  accent: string,
  detail: string,
  isBack: boolean,
): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.18"/>
    </filter>
  </defs>

  <!-- Suspension Cord from Rail -->
  <g stroke="#7A7A74" stroke-width="4" stroke-linecap="round">
    <line x1="512" y1="60" x2="512" y2="280" />
    <circle cx="512" cy="280" r="5" fill="#7A7A74" />
  </g>

  <!-- Garment Plane -->
  <g filter="url(#shadow)">
    <!-- 6-Panel Crown -->
    <path d="M 330,520 
             C 325,360 415,290 512,290 
             C 609,290 699,360 694,520 
             Z" 
          fill="${primary}" 
          stroke="${accent}" 
          stroke-width="4" />

    <!-- Panel Seam Stitch Lines -->
    <path d="M 512,290 L 512,520" stroke="${accent}" stroke-width="3" />
    <path d="M 512,290 C 450,340 405,420 390,520" stroke="${accent}" stroke-width="2.5" />
    <path d="M 512,290 C 574,340 619,420 634,520" stroke="${accent}" stroke-width="2.5" />

    <!-- Top Button (Squatchee) -->
    <circle cx="512" cy="290" r="14" fill="${accent}" stroke="${primary}" stroke-width="2" />

    ${!isBack
      ? `
      <!-- Curved Visor / Brim (Front View) -->
      <path d="M 280,515 
               C 360,575 664,575 744,515 
               C 700,490 324,490 280,515 Z" 
            fill="${primary}" 
            stroke="${accent}" 
            stroke-width="4" />
      <path d="M 310,524 C 380,570 644,570 714,524" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="6 4" />

      <!-- Front Embroidered Tonal Wordmark -->
      <g transform="translate(512, 440)" text-anchor="middle">
        <rect x="-50" y="-18" width="100" height="32" fill="${accent}" rx="3"/>
        <text x="0" y="4" font-family="Impact, sans-serif" font-size="18" fill="${detail}" letter-spacing="3">FITYN</text>
      </g>
    `
      : `
      <!-- Rear Cutout Arch & Adjustment Strap (Back View) -->
      <path d="M 440,520 C 440,450 584,450 584,520 Z" fill="#F3F3F0" stroke="${accent}" stroke-width="3.5" />
      
      <!-- Fabric Strap with Metal Clasp -->
      <rect x="420" y="508" width="184" height="22" fill="${primary}" stroke="${accent}" stroke-width="2.5" rx="3" />
      <rect x="548" y="504" width="26" height="30" fill="${detail}" stroke="${accent}" stroke-width="2" rx="2" />

      <!-- Minimal Rear Arch Micro-Stitch -->
      <g transform="translate(512, 410)" text-anchor="middle">
        <text x="0" y="0" font-family="monospace" font-size="11" font-weight="700" fill="${detail}" letter-spacing="2">WEAR THE CALM</text>
      </g>
    `
    }
  </g>
</svg>`;
}

// Auxiliary Textures: Hang-Tag, Rail, Ground-Shadow
function renderHangTagSvg(): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <filter id="tagShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Suspension Cord / String -->
  <path d="M 512,40 C 512,120 490,160 512,220" stroke="#1F2022" stroke-width="6" fill="none" stroke-linecap="round"/>

  <!-- Card Hang Tag -->
  <g filter="url(#tagShadow)">
    <rect x="332" y="210" width="360" height="640" rx="8" fill="#EAE8E1" stroke="#D1CEC5" stroke-width="4"/>

    <!-- Brass Grommet Hole -->
    <circle cx="512" cy="265" r="16" fill="#C8B88A" stroke="#7A6F4E" stroke-width="4"/>
    <circle cx="512" cy="265" r="8" fill="#F3F3F0"/>

    <!-- Minimal Typography on Card Tag -->
    <g transform="translate(512, 380)" text-anchor="middle">
      <text x="0" y="0" font-family="Impact, sans-serif" font-size="44" fill="#0A0A0A" letter-spacing="4">F I T Y N</text>
      <line x1="-120" y1="28" x2="120" y2="28" stroke="#486C2F" stroke-width="3"/>
      <text x="0" y="58" font-family="sans-serif" font-weight="600" font-size="13" fill="#486C2F" letter-spacing="3">WEAR THE CALM</text>

      <g transform="translate(0, 110)" text-anchor="start" font-family="monospace" font-size="12" fill="#2E2E2A">
        <text x="-120" y="0">ARCHETYPE: PHOTO-PLANE</text>
        <text x="-120" y="24">FABRIC: 100% ORGANIC COTTON</text>
        <text x="-120" y="48">ORIGIN: BENGALURU, INDIA</text>
        <text x="-120" y="72">CARE: COLD WASH / HANG DRY</text>
        <text x="-120" y="96">CERT: CALM ARCHIVE v1.0</text>
      </g>

      <!-- Barcode Graphic -->
      <g transform="translate(-110, 270)">
        <rect x="0" y="0" width="6" height="50" fill="#0A0A0A"/>
        <rect x="10" y="0" width="12" height="50" fill="#0A0A0A"/>
        <rect x="28" y="0" width="4" height="50" fill="#0A0A0A"/>
        <rect x="38" y="0" width="16" height="50" fill="#0A0A0A"/>
        <rect x="60" y="0" width="6" height="50" fill="#0A0A0A"/>
        <rect x="74" y="0" width="10" height="50" fill="#0A0A0A"/>
        <rect x="90" y="0" width="18" height="50" fill="#0A0A0A"/>
        <rect x="114" y="0" width="6" height="50" fill="#0A0A0A"/>
        <rect x="126" y="0" width="14" height="50" fill="#0A0A0A"/>
        <rect x="146" y="0" width="6" height="50" fill="#0A0A0A"/>
        <rect x="158" y="0" width="18" height="50" fill="#0A0A0A"/>
        <rect x="182" y="0" width="8" height="50" fill="#0A0A0A"/>
        <rect x="196" y="0" width="14" height="50" fill="#0A0A0A"/>
        <text x="110" y="68" text-anchor="middle" font-family="monospace" font-size="10" fill="#0A0A0A">8 901234 567890</text>
      </g>
    </g>
  </g>
</svg>`;
}

function renderRailSvg(): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 128" width="1024" height="128">
  <defs>
    <linearGradient id="metalRail" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E2E2DC" />
      <stop offset="25%" stop-color="#FFFFFF" />
      <stop offset="50%" stop-color="#BDBDB5" />
      <stop offset="80%" stop-color="#76766E" />
      <stop offset="100%" stop-color="#4E4E47" />
    </linearGradient>
    <filter id="railShadow" x="-5%" y="-20%" width="110%" height="200%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Horizontal Brushed Titanium Rail Bar -->
  <rect x="0" y="44" width="1024" height="40" rx="8" fill="url(#metalRail)" filter="url(#railShadow)"/>
  <line x1="0" y1="52" x2="1024" y2="52" stroke="#FFFFFF" stroke-width="2" opacity="0.6"/>
  <line x1="0" y1="78" x2="1024" y2="78" stroke="#3A3A35" stroke-width="2" opacity="0.4"/>
</svg>`;
}

function renderGroundShadowSvg(): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 512" width="1024" height="512">
  <defs>
    <radialGradient id="softContactShadow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0A0A0A" stop-opacity="0.32" />
      <stop offset="40%" stop-color="#0A0A0A" stop-opacity="0.18" />
      <stop offset="75%" stop-color="#0A0A0A" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#0A0A0A" stop-opacity="0.0" />
    </radialGradient>
  </defs>
  <ellipse cx="512" cy="256" rx="460" ry="140" fill="url(#softContactShadow)" />
</svg>`;
}

async function main() {
  console.log('--- FITYN ASSET PIPELINE: Generating Mock Garments & Auxiliary Textures ---');

  const baseDir = path.resolve(process.cwd(), 'public/garments');
  const texturesDir = path.join(baseDir, 'textures');

  fs.mkdirSync(baseDir, { recursive: true });
  fs.mkdirSync(texturesDir, { recursive: true });

  interface ManifestEntry {
    path: string;
    archetype?: string;
    variantKey?: string;
    side?: 'front' | 'back';
    resolution: string;
    width: number;
    height: number;
    fileSize: number;
  }

  const manifest: ManifestEntry[] = [];

  // Helper to generate and save WebP at 1024 and 2048
  async function generateWebpPair(
    svgContent: string,
    outputBaseFilename: string,
    subDir: string,
    meta: { archetype?: string; variantKey?: string; side?: 'front' | 'back' },
    isWide: boolean = false,
  ) {
    const targetDir = path.join(baseDir, subDir);
    fs.mkdirSync(targetDir, { recursive: true });

    const svgBuffer = Buffer.from(svgContent);

    // 1024px variant
    const h1024 = isWide ? 128 : isWide === false && meta.archetype === undefined && outputBaseFilename === 'ground-shadow' ? 512 : 1024;
    const path1024 = path.join(targetDir, `${outputBaseFilename}-1024.webp`);
    await sharp(svgBuffer)
      .resize(1024, h1024)
      .webp({ quality: 90, alphaQuality: 100, lossless: false })
      .toFile(path1024);

    const stat1024 = fs.statSync(path1024);
    manifest.push({
      path: `/garments/${subDir ? subDir + '/' : ''}${outputBaseFilename}-1024.webp`,
      ...meta,
      resolution: `1024x${h1024}`,
      width: 1024,
      height: h1024,
      fileSize: stat1024.size,
    });

    // 2048px variant
    const h2048 = isWide ? 256 : isWide === false && meta.archetype === undefined && outputBaseFilename === 'ground-shadow' ? 1024 : 2048;
    const path2048 = path.join(targetDir, `${outputBaseFilename}-2048.webp`);
    await sharp(svgBuffer)
      .resize(2048, h2048)
      .webp({ quality: 92, alphaQuality: 100, lossless: false })
      .toFile(path2048);

    const stat2048 = fs.statSync(path2048);
    manifest.push({
      path: `/garments/${subDir ? subDir + '/' : ''}${outputBaseFilename}-2048.webp`,
      ...meta,
      resolution: `2048x${h2048}`,
      width: 2048,
      height: h2048,
      fileSize: stat2048.size,
    });

    // Also write canonical alias without resolution suffix for backward-compatibility
    const canonicalPath = path.join(targetDir, `${outputBaseFilename}.webp`);
    fs.copyFileSync(path1024, canonicalPath);
    manifest.push({
      path: `/garments/${subDir ? subDir + '/' : ''}${outputBaseFilename}.webp`,
      ...meta,
      resolution: `1024x${h1024} (canonical)`,
      width: 1024,
      height: h1024,
      fileSize: stat1024.size,
    });
  }

  // 1. Generate Garments (5 Archetypes x 2 Colourways x 2 Sides = 20 asset pairs)
  for (const arch of ARCHETYPES) {
    console.log(`Generating Archetype: ${arch.name} (${arch.key})...`);

    for (const v of arch.variants) {
      // Front
      let frontSvg = '';
      let backSvg = '';

      switch (arch.key) {
        case 'tank-top':
          frontSvg = renderTankTopSvg(v.primaryHex, v.accentHex, v.detailHex, false);
          backSvg = renderTankTopSvg(v.primaryHex, v.accentHex, v.detailHex, true);
          break;
        case 'oversized-tee':
          frontSvg = renderOversizedTeeSvg(v.primaryHex, v.accentHex, v.detailHex, false);
          backSvg = renderOversizedTeeSvg(v.primaryHex, v.accentHex, v.detailHex, true);
          break;
        case 'hoodie':
          frontSvg = renderHoodieSvg(v.primaryHex, v.accentHex, v.detailHex, false);
          backSvg = renderHoodieSvg(v.primaryHex, v.accentHex, v.detailHex, true);
          break;
        case 'bomber-jacket':
          frontSvg = renderBomberJacketSvg(v.primaryHex, v.accentHex, v.detailHex, false);
          backSvg = renderBomberJacketSvg(v.primaryHex, v.accentHex, v.detailHex, true);
          break;
        case 'cap':
          frontSvg = renderCapSvg(v.primaryHex, v.accentHex, v.detailHex, false);
          backSvg = renderCapSvg(v.primaryHex, v.accentHex, v.detailHex, true);
          break;
      }

      await generateWebpPair(
        frontSvg,
        `${v.variantKey}-front`,
        arch.key,
        { archetype: arch.key, variantKey: v.variantKey, side: 'front' },
        false,
      );

      await generateWebpPair(
        backSvg,
        `${v.variantKey}-back`,
        arch.key,
        { archetype: arch.key, variantKey: v.variantKey, side: 'back' },
        false,
      );
    }
  }

  // 2. Generate Auxiliary Assets
  console.log('Generating Auxiliary Textures (hang-tag, rail, ground-shadow)...');

  await generateWebpPair(
    renderHangTagSvg(),
    'hang-tag',
    'textures',
    {},
    false,
  );

  await generateWebpPair(
    renderRailSvg(),
    'rail',
    'textures',
    {},
    true, // isWide
  );

  await generateWebpPair(
    renderGroundShadowSvg(),
    'ground-shadow',
    'textures',
    {},
    false,
  );

  // Write Manifest
  const manifestPath = path.join(baseDir, '.manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`\nAsset Generation Complete! Generated ${manifest.length} total WebP assets.`);
  console.log(`Manifest saved to: ${manifestPath}`);
}

main().catch((err) => {
  console.error('Asset generation failed:', err);
  process.exit(1);
});