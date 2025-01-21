import clsx from 'clsx';
import { Suspense } from 'react';
import { getCollectionFacetValues, getFacets } from '@/lib/vendure';
import FacetsFilter from './facets-filter';
import { FacetFragment } from '@/lib/vendure/types';

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
        <div className="gap-4 hidden w-full py-4 lg:flex">
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
        </div>
      }
    >
      <FacetsList facets={facets} collection={collection} />
    </Suspense>
  );
}
