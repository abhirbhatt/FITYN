import React from 'react';
import { ProductDetailView } from '@/components/product/ProductDetailView';
import { PRODUCTS } from '@/data/products';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  return <ProductDetailView slug={slug} />;
}
