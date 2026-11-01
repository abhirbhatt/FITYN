import React from 'react';
import { CollectionDetailView } from '@/components/collections/CollectionDetailView';

  interface CollectionDetailPageProps {
    params: Promise<{ slug: string }>;
  }

export default async function CollectionDetailPage({
  params,
}: CollectionDetailPageProps) {
  const { slug } = await params;
  return <CollectionDetailView slug={slug} />;
}
