import React from 'react';
import { ProductDetailView } from '@/components/product/ProductDetailView';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  return <ProductDetailView slug={slug} />;
}
