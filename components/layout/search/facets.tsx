import { cn } from '@/lib/utils';
import { getCollectionFacetValues } from '@/lib/vendure';
import { FacetFragment } from '@/lib/vendure/types';
import { Suspense } from 'react';
import FacetsFilter from './facets-filter';
const skeleton = 'h-10 w-full animate-pulse rounded';
const items = 'bg-neutral-400 dark:bg-neutral-700';

async function FacetsList({ collection, facets }: { collection: string; facets: FacetFragment[] }) {
  const collectionFacetValues = collection ? await getCollectionFacetValues({ collection }) : [];

  return <FacetsFilter list={facets} collectionFacetValues={collectionFacetValues}></FacetsFilter>;
}

export default function Facets({
  collection,
  facets
}: {
  collection: string;
  facets: FacetFragment[];
}) {
  return (
    <Suspense
      fallback={
        <div className="hidden w-full gap-4 py-4 lg:flex">
          <div className={cn(skeleton, items)} />
          <div className={cn(skeleton, items)} />
          <div className={cn(skeleton, items)} />
          <div className={cn(skeleton, items)} />
        </div>
      }
    >
      <FacetsList facets={facets} collection={collection} />
    </Suspense>
  );
}
