import clsx from 'clsx';
import { Suspense } from 'react';

import { getCollections } from 'lib/vendure';
import FilterList from './filter';

async function CollectionList() {
  const collections = await getCollections();


  // Create a map of collections by their id
  const collectionMap = new Map(collections.map(collection => [collection.id, collection]));

  // Sort collections based on parentId
  collections.sort((a, b) => {
    if (a.parentId === b.id) {
      return 1;
    }
    if (b.parentId === a.id) {
      return -1;
    }
    return 0;
  });

  return <FilterList list={collections} title="Collections" />;
}

const skeleton = 'mb-3 h-4 w-5/6 animate-pulse rounded';
const activeAndTitles = 'bg-neutral-800 dark:bg-neutral-300';
const items = 'bg-neutral-400 dark:bg-neutral-700';

export default function Collections() {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
        </div>
      }
    >
      <CollectionList />
    </Suspense>
  );
}
