import { Collection } from '@/lib/types/commerce';

export const COLLECTIONS: Collection[] = [
  {
    id: 'col_monochrome',
    slug: 'monochrome-essentials',
    name: 'Monochrome Essentials',
    subtitle: 'High-density cotton basics in washed slate and pure onyx',
    description:
      'Engineered for everyday stillness. Heavyweight combed cottons cut in relaxed, architectural proportions with custom pigment washes.',
    productIds: ['prod_01', 'prod_02', 'prod_03'],
  },
  {
    id: 'col_outerwear',
    slug: 'calm-outerwear',
    name: 'Calm Outerwear',
    subtitle: 'Water-resistant twill bombers and structural double-fleece hoods',
    description:
      'Substantial protective layers tailored with clean lines, functional closures, and deep comfort for urban movement.',
    productIds: ['prod_04', 'prod_05', 'prod_06'],
  },
  {
    id: 'col_headwear',
    slug: 'capsule-headwear',
    name: 'Capsule Headwear',
    subtitle: 'Unstructured 6-panel caps with tonal micro embroidery',
    description:
      'Low-profile cotton twill caps with custom hardware clasps and tactile curved brims.',
    productIds: ['prod_07'],
  },
];

