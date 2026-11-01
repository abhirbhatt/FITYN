import React from 'react';
import { CollectionDetailView } from '@/components/collections/CollectionDetailView';
import { COLLECTIONS } from '@/data/collections';

interface CollectionDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return COLLECTIONS.map((collection) => ({
    slug: collection.slug,
  }));
}

export default async function CollectionDetailPage({
  params,
}: CollectionDetailPageProps) {
  const { slug } = await params;
  return <CollectionDetailView slug={slug} />;
}
