import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { PRODUCTS } from '../data/products';
import { COLLECTIONS } from '../data/collections';
import { ProductSchema, CollectionSchema } from '../lib/types/commerce';

async function validateAssets() {
  console.log('--- FITYN ASSET & CATALOG VALIDATOR ---');
  let errors: string[] = [];

  const publicDir = path.resolve(process.cwd(), 'public');
  const manifestPath = path.join(publicDir, 'garments', '.manifest.json');

  // 1. Validate Manifest Exists
  if (!fs.existsSync(manifestPath)) {
    errors.push(`Missing manifest file at ${manifestPath}`);
  } else {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      console.log(`✓ Manifest loaded with ${manifest.length} registered asset entries.`);
    } catch (e: any) {
      errors.push(`Failed to parse manifest: ${e.message}`);
    }
  }

  // 2. Validate Collections Schema & Uniqueness
  const collectionIds = new Set<string>();
  const collectionSlugs = new Set<string>();

  for (const col of COLLECTIONS) {
    try {
      CollectionSchema.parse(col);
    } catch (e: any) {
      errors.push(`Collection validation error (${col.id}): ${e.message}`);
    }

    if (collectionIds.has(col.id)) {
      errors.push(`Duplicate collection ID found: ${col.id}`);
    }
    collectionIds.add(col.id);

    if (collectionSlugs.has(col.slug)) {
      errors.push(`Duplicate collection slug found: ${col.slug}`);
    }
    collectionSlugs.add(col.slug);
  }
  console.log(`✓ Validated ${COLLECTIONS.length} curated collections.`);

  // 3. Validate Products Schema, Uniqueness & Asset Integrity
  const productIds = new Set<string>();
  const productSlugs = new Set<string>();
  const variantIds = new Set<string>();

  if (PRODUCTS.length !== 7) {
    errors.push(`Expected exactly 7 catalog products per blueprint, found ${PRODUCTS.length}`);
  }

  for (const prod of PRODUCTS) {
    try {
      ProductSchema.parse(prod);
    } catch (e: any) {
      errors.push(`Product schema validation error (${prod.id}): ${e.message}`);
    }

    // Unique Product ID
    if (productIds.has(prod.id)) {
      errors.push(`Duplicate product ID: ${prod.id}`);
    }
    productIds.add(prod.id);

    // Unique Product Slug
    if (productSlugs.has(prod.slug)) {
      errors.push(`Duplicate product slug: ${prod.slug}`);
    }
    productSlugs.add(prod.slug);

    // Each product must have at least 2 colourway variants
    if (prod.variants.length < 2) {
      errors.push(`Product ${prod.id} has fewer than 2 colourway variants (${prod.variants.length})`);
    }

    // Validate Variants
    for (const v of prod.variants) {
      if (variantIds.has(v.id)) {
        errors.push(`Duplicate variant ID: ${v.id}`);
      }
      variantIds.add(v.id);

      // Check canonical front & back textures
      const frontPath = path.join(publicDir, v.frontTexture.replace(/^\//, ''));
      const backPath = path.join(publicDir, v.backTexture.replace(/^\//, ''));

      if (!fs.existsSync(frontPath)) {
        errors.push(`Variant ${v.id} front texture missing: ${frontPath}`);
      }
      if (!fs.existsSync(backPath)) {
        errors.push(`Variant ${v.id} back texture missing: ${backPath}`);
      }

      // Check multi-resolution textures
      if (!v.textures) {
        errors.push(`Variant ${v.id} is missing multi-resolution textures definition.`);
      } else {
        const requiredTextures = [
          { pathKey: 'front1024', expectedW: 1024, rel: v.textures.front1024 },
          { pathKey: 'back1024', expectedW: 1024, rel: v.textures.back1024 },
          { pathKey: 'front2048', expectedW: 2048, rel: v.textures.front2048 },
          { pathKey: 'back2048', expectedW: 2048, rel: v.textures.back2048 },
        ];

        for (const t of requiredTextures) {
          const fullPath = path.join(publicDir, t.rel.replace(/^\//, ''));
          if (!fs.existsSync(fullPath)) {
            errors.push(`Variant ${v.id} texture missing (${t.pathKey}): ${fullPath}`);
          } else {
            try {
              const meta = await sharp(fullPath).metadata();
              if (meta.width !== t.expectedW) {
                errors.push(
                  `Dimension mismatch on ${t.rel}: expected width ${t.expectedW}, got ${meta.width}`,
                );
              }
              if (!meta.hasAlpha) {
                errors.push(`Alpha channel missing on ${t.rel}. Background must be transparent.`);
              }
            } catch (err: any) {
              errors.push(`Failed to read metadata for ${fullPath}: ${err.message}`);
            }
          }
        }
      }
    }
  }

  // 4. Validate Auxiliary Assets
  const auxiliaryAssets = [
    { name: 'hang-tag-1024.webp', expectedW: 1024, expectedH: 1024 },
    { name: 'hang-tag-2048.webp', expectedW: 2048, expectedH: 2048 },
    { name: 'rail-1024.webp', expectedW: 1024, expectedH: 128 },
    { name: 'rail-2048.webp', expectedW: 2048, expectedH: 256 },
    { name: 'ground-shadow-1024.webp', expectedW: 1024, expectedH: 512 },
    { name: 'ground-shadow-2048.webp', expectedW: 2048, expectedH: 1024 },
  ];

  for (const aux of auxiliaryAssets) {
    const auxPath = path.join(publicDir, 'garments', 'textures', aux.name);
    if (!fs.existsSync(auxPath)) {
      errors.push(`Auxiliary texture missing: ${auxPath}`);
    } else {
      try {
        const meta = await sharp(auxPath).metadata();
        if (meta.width !== aux.expectedW || meta.height !== aux.expectedH) {
          errors.push(
            `Auxiliary texture dimension mismatch on ${aux.name}: expected ${aux.expectedW}x${aux.expectedH}, got ${meta.width}x${meta.height}`,
          );
        }
        if (!meta.hasAlpha) {
          errors.push(`Auxiliary texture ${aux.name} missing transparent alpha channel.`);
        }
      } catch (err: any) {
        errors.push(`Failed to verify auxiliary texture ${aux.name}: ${err.message}`);
      }
    }
  }

  // 5. Final Report & Exit
  if (errors.length > 0) {
    console.error(`\n❌ ASSET VALIDATION FAILED WITH ${errors.length} ERRORS:`);
    errors.forEach((err, i) => console.error(`  ${i + 1}. ${err}`));
    process.exit(1);
  }

  console.log(`\n✅ ALL ASSETS & CATALOG ENTRIES VALIDATED SUCCESSFULLY.`);
  console.log(`  - 7 Products validated.`);
  console.log(`  - 14 Product variants validated.`);
  console.log(`  - Multi-resolution (1024px & 2048px) alpha transparency verified.`);
  console.log(`  - Auxiliary textures verified.`);
}

validateAssets().catch((err) => {
  console.error('Validator crashed:', err);
  process.exit(1);
});

