import {
  getActiveChannel,
  getCollection,
  getCollectionFacetValues,
  getCollectionProducts,
  getFacets
} from 'lib/vendure';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Grid from '@/components/grid';
import ProductGridItems from '@/components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import Facets from '@/components/layout/search/facets';
import { CollectionProvider } from '@/components/layout/search/collection-context';

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  return {
    title: collection.name,
    description: collection.description
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, direction } = sorting.find((item) => item.slug === sort) || defaultSort;
  const facets = await getFacets();
  const collection = await getCollection(params.collection);

  const facetFilters = facets
    .map((facet) => {
      const valueIdsAsString = searchParams?.[facet.code] as string | undefined;
      return {
        or: valueIdsAsString?.split(',') ?? []
      };
    })
    .filter((facetFilter) => facetFilter.or.length > 0);

  const products = await getCollectionProducts({
    collection: params.collection,
    sortKey,
    direction,
    facetValueFilters: facetFilters
  });
  const activeChannel = await getActiveChannel();

  return (
    <CollectionProvider collection={collection}>
      <section>
        <Facets facets={facets} collection={params.collection}></Facets>
        {products.length === 0 ? (
          <p className="py-3 text-lg">{`No products found in this collection`}</p>
        ) : (
          <Grid className="mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ProductGridItems
              currencyCode={activeChannel.defaultCurrencyCode}
              products={products}
            />
          </Grid>
        )}
      </section>
    </CollectionProvider>
  );
}
