import { z } from 'zod';

export type GarmentSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface GarmentTextures {
  front1024: string;
  back1024: string;
  front2048: string;
  back2048: string;
}

export interface Garment3DModel {
  glbUrl: string;
  dracoCompressed: boolean;
  triangleCount: number;
}

export interface ProductVariant {
  id: string;
  colourName: string;
  colourHex: string;
  // Canonical 1024px WebP texture paths for backward-compatible consumption
  frontTexture: string;
  backTexture: string;
  // Extended multi-resolution textures (1024px mobile, 2048px desktop)
  textures?: GarmentTextures;
  // Future-compatible 3D model metadata
  model3D?: Garment3DModel;
  sizes: Array<{
    size: GarmentSize;
    stock: number;
  }>;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number; // in INR paise (e.g., 299900 = ₹2,999.00)
  currency: 'INR';
  description: string;
  details: string[];
  collectionIds: string[];
  archetype: 'tank-top' | 'oversized-tee' | 'hoodie' | 'bomber-jacket' | 'cap';
  variants: ProductVariant[];
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  productIds: string[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  size: string;
  quantity: number;
  unitPrice: number;
  productName: string;
  colourName: string;
  thumbnail: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  status: 'PENDING' | 'CONFIRMED' | 'DISPATCHED';
}

// Zod Validation Schemas
export const GarmentSizeSchema = z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']);

export const VariantSizeSchema = z.object({
  size: GarmentSizeSchema,
  stock: z.number().int().nonnegative(),
});

export const GarmentTexturesSchema = z.object({
  front1024: z.string().startsWith('/garments/'),
  back1024: z.string().startsWith('/garments/'),
  front2048: z.string().startsWith('/garments/'),
  back2048: z.string().startsWith('/garments/'),
});

export const Garment3DModelSchema = z.object({
  glbUrl: z.string(),
  dracoCompressed: z.boolean(),
  triangleCount: z.number().int().positive(),
}).optional();

export const ProductVariantSchema = z.object({
  id: z.string().min(1),
  colourName: z.string().min(1),
  colourHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  frontTexture: z.string().startsWith('/garments/'),
  backTexture: z.string().startsWith('/garments/'),
  textures: GarmentTexturesSchema.optional(),
  model3D: Garment3DModelSchema,
  sizes: z.array(VariantSizeSchema).min(1),
});

export const ProductSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  subtitle: z.string().min(1),
  price: z.number().int().positive(),
  currency: z.literal('INR'),
  description: z.string().min(1),
  details: z.array(z.string()).min(1),
  collectionIds: z.array(z.string()).min(1),
  archetype: z.enum(['tank-top', 'oversized-tee', 'hoodie', 'bomber-jacket', 'cap']),
  variants: z.array(ProductVariantSchema).min(1),
});

export const CollectionSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  subtitle: z.string().min(1),
  description: z.string().min(1),
  productIds: z.array(z.string()).min(1),
});

