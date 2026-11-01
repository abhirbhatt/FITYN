import { Product } from '@/lib/types/commerce';

export const PRODUCTS: Product[] = [
  {
    id: 'prod_01',
    slug: 'raw-hem-tank',
    name: 'Raw Hem Tank',
    subtitle: '240 GSM Dropped Armhole Tank',
    price: 249900, // ₹2,499.00
    currency: 'INR',
    description:
      'A relaxed, sleeveless silhouette crafted from heavyweight 240 GSM organic cotton. Features raw-cut bound edges, deep armholes, and subtle architectural back framing.',
    details: [
      '100% combed organic cotton',
      '240 GSM single jersey',
      'Pre-shrunk with custom enzyme wash',
      'Subtle back monochrome typographic insignia',
      'Cut and assembled in Bengaluru, India',
    ],
    collectionIds: ['col_monochrome'],
    archetype: 'tank-top',
    variants: [
      {
        id: 'var_01_slate',
        colourName: 'Washed Slate',
        colourHex: '#2A3036',
        frontTexture: '/garments/tank-top/slate-front.webp',
        backTexture: '/garments/tank-top/slate-back.webp',
        textures: {
          front1024: '/garments/tank-top/slate-front-1024.webp',
          back1024: '/garments/tank-top/slate-back-1024.webp',
          front2048: '/garments/tank-top/slate-front-2048.webp',
          back2048: '/garments/tank-top/slate-back-2048.webp',
        },
        sizes: [
          { size: 'S', stock: 15 },
          { size: 'M', stock: 24 },
          { size: 'L', stock: 18 },
          { size: 'XL', stock: 8 },
        ],
      },
      {
        id: 'var_01_bone',
        colourName: 'Bone Chalk',
        colourHex: '#D5D4CB',
        frontTexture: '/garments/tank-top/bone-front.webp',
        backTexture: '/garments/tank-top/bone-back.webp',
        textures: {
          front1024: '/garments/tank-top/bone-front-1024.webp',
          back1024: '/garments/tank-top/bone-back-1024.webp',
          front2048: '/garments/tank-top/bone-front-2048.webp',
          back2048: '/garments/tank-top/bone-back-2048.webp',
        },
        sizes: [
          { size: 'S', stock: 10 },
          { size: 'M', stock: 20 },
          { size: 'L', stock: 14 },
          { size: 'XL', stock: 5 },
        ],
      },
    ],
  },
  {
    id: 'prod_02',
    slug: 'heavyweight-boxy-tee',
    name: 'Heavyweight Boxy Tee',
    subtitle: '280 GSM Relaxed Drop-Shoulder Tee',
    price: 299900, // ₹2,999.00
    currency: 'INR',
    description:
      'The foundational FITYN silhouette. Cut from dense 280 GSM combed jersey with wide dropped shoulders, elbow-length sleeves, and a dense ribbed collar that retains structure.',
    details: [
      '280 GSM high-density cotton jersey',
      'Wide boxy fit with dropped shoulders',
      '1x1 ribbed 30mm collar band',
      'Center-back oversized typographic manifesto',
      'Reinforced twin-needle hem stitching',
    ],
    collectionIds: ['col_monochrome'],
    archetype: 'oversized-tee',
    variants: [
      {
        id: 'var_02_onyx',
        colourName: 'Onyx Black',
        colourHex: '#141416',
        frontTexture: '/garments/oversized-tee/onyx-front.webp',
        backTexture: '/garments/oversized-tee/onyx-back.webp',
        textures: {
          front1024: '/garments/oversized-tee/onyx-front-1024.webp',
          back1024: '/garments/oversized-tee/onyx-back-1024.webp',
          front2048: '/garments/oversized-tee/onyx-front-2048.webp',
          back2048: '/garments/oversized-tee/onyx-back-2048.webp',
        },
        sizes: [
          { size: 'XS', stock: 6 },
          { size: 'S', stock: 28 },
          { size: 'M', stock: 45 },
          { size: 'L', stock: 32 },
          { size: 'XL', stock: 16 },
        ],
      },
      {
        id: 'var_02_olive',
        colourName: 'Washed Olive',
        colourHex: '#486C2F',
        frontTexture: '/garments/oversized-tee/olive-front.webp',
        backTexture: '/garments/oversized-tee/olive-back.webp',
        textures: {
          front1024: '/garments/oversized-tee/olive-front-1024.webp',
          back1024: '/garments/oversized-tee/olive-back-1024.webp',
          front2048: '/garments/oversized-tee/olive-front-2048.webp',
          back2048: '/garments/oversized-tee/olive-back-2048.webp',
        },
        sizes: [
          { size: 'S', stock: 18 },
          { size: 'M', stock: 30 },
          { size: 'L', stock: 22 },
          { size: 'XL', stock: 10 },
        ],
      },
    ],
  },
  {
    id: 'prod_03',
    slug: 'architectural-drop-tee',
    name: 'Architectural Drop Tee',
    subtitle: '300 GSM Heavyweight Capsule Edition',
    price: 329900, // ₹3,299.00
    currency: 'INR',
    description:
      'A structured variation of the signature tee, featuring a slightly longer torso and minimal tonal chest stamp. Designed to drape with crisp architectural planes.',
    details: [
      '300 GSM premium ring-spun cotton',
      'Blind-stitched sleeve cuffs and hem',
      'Tonal silicone chest micro-mark',
      'Pigment dyed for vintage depth',
    ],
    collectionIds: ['col_monochrome'],
    archetype: 'oversized-tee',
    variants: [
      {
        id: 'var_03_onyx',
        colourName: 'Onyx Black',
        colourHex: '#141416',
        frontTexture: '/garments/oversized-tee/onyx-front.webp',
        backTexture: '/garments/oversized-tee/onyx-back.webp',
        textures: {
          front1024: '/garments/oversized-tee/onyx-front-1024.webp',
          back1024: '/garments/oversized-tee/onyx-back-1024.webp',
          front2048: '/garments/oversized-tee/onyx-front-2048.webp',
          back2048: '/garments/oversized-tee/onyx-back-2048.webp',
        },
        sizes: [
          { size: 'S', stock: 12 },
          { size: 'M', stock: 25 },
          { size: 'L', stock: 18 },
          { size: 'XL', stock: 6 },
        ],
      },
      {
        id: 'var_03_olive',
        colourName: 'Washed Olive',
        colourHex: '#486C2F',
        frontTexture: '/garments/oversized-tee/olive-front.webp',
        backTexture: '/garments/oversized-tee/olive-back.webp',
        textures: {
          front1024: '/garments/oversized-tee/olive-front-1024.webp',
          back1024: '/garments/oversized-tee/olive-back-1024.webp',
          front2048: '/garments/oversized-tee/olive-front-2048.webp',
          back2048: '/garments/oversized-tee/olive-back-2048.webp',
        },
        sizes: [
          { size: 'S', stock: 14 },
          { size: 'M', stock: 22 },
          { size: 'L', stock: 16 },
          { size: 'XL', stock: 8 },
        ],
      },
    ],
  },
  {
    id: 'prod_04',
    slug: 'heavy-fleece-hoodie',
    name: 'Heavy Fleece Hoodie',
    subtitle: '420 GSM Brushed Loopback Pullover',
    price: 499900, // ₹4,999.00
    currency: 'INR',
    description:
      'Substantial 420 GSM loopback cotton fleece with a double-layered structured hood that stands upright without cord tension. Features a wide kangaroo pocket and seamless sides.',
    details: [
      '420 GSM custom loopback terry fleece',
      'Dual-ply structured hood',
      'Kangaroo hand pocket with bartack anchors',
      'Heavy 2x2 ribbing at cuffs and waist',
      'Garment washed for a lived-in calm drape',
    ],
    collectionIds: ['col_outerwear'],
    archetype: 'hoodie',
    variants: [
      {
        id: 'var_04_charcoal',
        colourName: 'Deep Charcoal',
        colourHex: '#1C1D21',
        frontTexture: '/garments/hoodie/charcoal-front.webp',
        backTexture: '/garments/hoodie/charcoal-back.webp',
        textures: {
          front1024: '/garments/hoodie/charcoal-front-1024.webp',
          back1024: '/garments/hoodie/charcoal-back-1024.webp',
          front2048: '/garments/hoodie/charcoal-front-2048.webp',
          back2048: '/garments/hoodie/charcoal-back-2048.webp',
        },
        sizes: [
          { size: 'S', stock: 14 },
          { size: 'M', stock: 26 },
          { size: 'L', stock: 20 },
          { size: 'XL', stock: 12 },
        ],
      },
      {
        id: 'var_04_chalk',
        colourName: 'Chalk White',
        colourHex: '#E2E1DA',
        frontTexture: '/garments/hoodie/chalk-front.webp',
        backTexture: '/garments/hoodie/chalk-back.webp',
        textures: {
          front1024: '/garments/hoodie/chalk-front-1024.webp',
          back1024: '/garments/hoodie/chalk-back-1024.webp',
          front2048: '/garments/hoodie/chalk-front-2048.webp',
          back2048: '/garments/hoodie/chalk-back-2048.webp',
        },
        sizes: [
          { size: 'S', stock: 10 },
          { size: 'M', stock: 18 },
          { size: 'L', stock: 15 },
          { size: 'XL', stock: 6 },
        ],
      },
    ],
  },
  {
    id: 'prod_05',
    slug: 'restful-utility-hoodie',
    name: 'Restful Utility Hoodie',
    subtitle: '420 GSM Thermal Heavy Pullover',
    price: 529900, // ₹5,299.00
    currency: 'INR',
    description:
      'An insulated variant of the core hoodie featuring thermal inner lining, minimal contrast drawstrings, and an understated back utility graphic.',
    details: [
      '420 GSM French terry body',
      'Dual metal eyelets with coated aglet cords',
      'Reinforced thumbhole cuff loops',
      'Back capsule coordinate typography',
    ],
    collectionIds: ['col_outerwear'],
    archetype: 'hoodie',
    variants: [
      {
        id: 'var_05_charcoal',
        colourName: 'Deep Charcoal',
        colourHex: '#1C1D21',
        frontTexture: '/garments/hoodie/charcoal-front.webp',
        backTexture: '/garments/hoodie/charcoal-back.webp',
        textures: {
          front1024: '/garments/hoodie/charcoal-front-1024.webp',
          back1024: '/garments/hoodie/charcoal-back-1024.webp',
          front2048: '/garments/hoodie/charcoal-front-2048.webp',
          back2048: '/garments/hoodie/charcoal-back-2048.webp',
        },
        sizes: [
          { size: 'S', stock: 8 },
          { size: 'M', stock: 16 },
          { size: 'L', stock: 14 },
          { size: 'XL', stock: 6 },
        ],
      },
      {
        id: 'var_05_chalk',
        colourName: 'Chalk White',
        colourHex: '#E2E1DA',
        frontTexture: '/garments/hoodie/chalk-front.webp',
        backTexture: '/garments/hoodie/chalk-back.webp',
        textures: {
          front1024: '/garments/hoodie/chalk-front-1024.webp',
          back1024: '/garments/hoodie/chalk-back-1024.webp',
          front2048: '/garments/hoodie/chalk-front-2048.webp',
          back2048: '/garments/hoodie/chalk-back-2048.webp',
        },
        sizes: [
          { size: 'S', stock: 12 },
          { size: 'M', stock: 20 },
          { size: 'L', stock: 10 },
          { size: 'XL', stock: 4 },
        ],
      },
    ],
  },
  {
    id: 'prod_06',
    slug: 'twill-flight-bomber',
    name: 'Twill Flight Bomber',
    subtitle: 'Water-Resistant Technical Shell',
    price: 649900, // ₹6,499.00
    currency: 'INR',
    description:
      'A modern interpretation of the flight jacket in matte technical cotton twill. Features gunmetal hardware, sleeve utility compartment with red ribbon accent, and a stand ribbed baseball collar.',
    details: [
      'High-twist cotton twill with DWR water-resistant finish',
      'Heavy-gauge YKK metal two-way zipper',
      'Sleeve utility zippered pocket with signature lanyard',
      'Angled welt side hand-warmer pockets',
      'Internal chest stash pocket',
    ],
    collectionIds: ['col_outerwear'],
    archetype: 'bomber-jacket',
    variants: [
      {
        id: 'var_06_tactical_olive',
        colourName: 'Tactical Olive',
        colourHex: '#3C4E2C',
        frontTexture: '/garments/bomber-jacket/tactical-olive-front.webp',
        backTexture: '/garments/bomber-jacket/tactical-olive-back.webp',
        textures: {
          front1024: '/garments/bomber-jacket/tactical-olive-front-1024.webp',
          back1024: '/garments/bomber-jacket/tactical-olive-back-1024.webp',
          front2048: '/garments/bomber-jacket/tactical-olive-front-2048.webp',
          back2048: '/garments/bomber-jacket/tactical-olive-back-2048.webp',
        },
        sizes: [
          { size: 'S', stock: 8 },
          { size: 'M', stock: 18 },
          { size: 'L', stock: 12 },
          { size: 'XL', stock: 5 },
        ],
      },
      {
        id: 'var_06_pitch_black',
        colourName: 'Pitch Black',
        colourHex: '#0E0F12',
        frontTexture: '/garments/bomber-jacket/pitch-black-front.webp',
        backTexture: '/garments/bomber-jacket/pitch-black-back.webp',
        textures: {
          front1024: '/garments/bomber-jacket/pitch-black-front-1024.webp',
          back1024: '/garments/bomber-jacket/pitch-black-back-1024.webp',
          front2048: '/garments/bomber-jacket/pitch-black-front-2048.webp',
          back2048: '/garments/bomber-jacket/pitch-black-back-2048.webp',
        },
        sizes: [
          { size: 'S', stock: 10 },
          { size: 'M', stock: 22 },
          { size: 'L', stock: 16 },
          { size: 'XL', stock: 7 },
        ],
      },
    ],
  },
  {
    id: 'prod_07',
    slug: '6-panel-structured-cap',
    name: '6-Panel Structured Cap',
    subtitle: 'Low-Profile Washed Cotton Cap',
    price: 179900, // ₹1,799.00
    currency: 'INR',
    description:
      'An unhurried daily staple. Crafted from 100% brushed chino twill with a curved visor, embroidered eyelets, and an adjustable strap with an antique brass closure.',
    details: [
      '100% brushed cotton chino twill',
      'Unstructured 6-panel low crown',
      'Pre-curved brim with tonal stitching',
      'Tonal direct embroidery front insignia',
      'Matching fabric strap with matte metal slider',
    ],
    collectionIds: ['col_headwear'],
    archetype: 'cap',
    variants: [
      {
        id: 'var_07_black',
        colourName: 'Onyx Black',
        colourHex: '#121316',
        frontTexture: '/garments/cap/black-front.webp',
        backTexture: '/garments/cap/black-back.webp',
        textures: {
          front1024: '/garments/cap/black-front-1024.webp',
          back1024: '/garments/cap/black-back-1024.webp',
          front2048: '/garments/cap/black-front-2048.webp',
          back2048: '/garments/cap/black-back-2048.webp',
        },
        sizes: [
          { size: 'M', stock: 40 },
          { size: 'L', stock: 35 },
        ],
      },
      {
        id: 'var_07_stone',
        colourName: 'Raw Stone',
        colourHex: '#C5C3BA',
        frontTexture: '/garments/cap/stone-front.webp',
        backTexture: '/garments/cap/stone-back.webp',
        textures: {
          front1024: '/garments/cap/stone-front-1024.webp',
          back1024: '/garments/cap/stone-back-1024.webp',
          front2048: '/garments/cap/stone-front-2048.webp',
          back2048: '/garments/cap/stone-back-2048.webp',
        },
        sizes: [
          { size: 'M', stock: 25 },
          { size: 'L', stock: 20 },
        ],
      },
    ],
  },
];

