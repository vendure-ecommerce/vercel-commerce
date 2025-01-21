'use client';

import { createContext, useContext } from 'react';
import { CollectionFragment } from '@/lib/vendure/types';

const CollectionContext = createContext<CollectionFragment | undefined | null>(undefined);

export function CollectionProvider({
  children,
  collection
}: {
  children: any;
  collection: CollectionFragment | undefined | null;
}) {
  return <CollectionContext.Provider value={collection}>{children}</CollectionContext.Provider>;
}

export const useCollection = () => {
  const context = useContext(CollectionContext);

  if (context === undefined) {
    throw new Error('useCollection must be used within a CollectionProvider');
  }

  return context;
};
